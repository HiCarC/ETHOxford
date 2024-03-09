import argparse
import warnings
from collections import OrderedDict
import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split
import flwr as fl
import torch
import torch.nn as nn
import torch.nn.functional as F
from torch.utils.data import DataLoader
from torchvision.transforms import Compose, Normalize, ToTensor
from tqdm import tqdm


# #############################################################################
# 1. Regular PyTorch pipeline: nn.Module, train, test, and DataLoader
# #############################################################################

warnings.filterwarnings("ignore", category=UserWarning)
DEVICE = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")


class Net(nn.Module):
    def __init__(self) -> None:
        super(Net, self).__init__()
        self.layer_1 = nn.Linear(17, 5) 
        self.layer_out = nn.Linear(5, 1) 
        self.relu = nn.ReLU()
        self.sigmoid = nn.Sigmoid()

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        x = self.relu(self.layer_1(x))
        x = self.layer_out(x)
        x = self.sigmoid(x)
        return x


def train(net, trainloader, epochs):
    """Train the model on the training set."""
    criterion = torch.nn.BCEWithLogitsLoss()
    optimizer = torch.optim.SGD(net.parameters(), lr=0.001, momentum=0.9)
    for _ in range(epochs):
        x = torch.from_numpy(trainloader[0]).float()
        y = torch.from_numpy(trainloader[1]).float().view(-1, 1)

        optimizer.zero_grad()
        outputs = net(x)
        loss = criterion(outputs, y)

        loss.backward()
        optimizer.step()


def test(net, testloader):
    """Validate the model on the test set."""
    criterion = torch.nn.BCEWithLogitsLoss()
    correct, loss = 0, 0.0

    with torch.no_grad():

        x = torch.from_numpy(testloader[0]).float()
        y = torch.from_numpy(testloader[1]).float().view(-1, 1)

        outputs = net(x)
        loss += criterion(outputs, y).item()

        predictions = (outputs > 0.5).float()  # Apply threshold of 0.5
        correct += (predictions == y).sum().item()

    accuracy = correct / len(testloader[0])
    print(f"Test Accuracy: {accuracy * 100:.2f}%")
    print(f"Test Loss: {loss / len(testloader)}")

    return loss, accuracy


def load_data(partition_id):
    datasets = {0:"c1.csv", 1:"c2.csv"}

    data = pd.read_csv(datasets[partition_id])
    data.reset_index(drop=True)
    df =np.array(data)
    x = df[:,1:]
    y =df[:,0]

    x_train,x_test,y_train,y_test= train_test_split(x,y, test_size=0.2, random_state=42, shuffle=True, stratify=y)
    return (x_train, y_train), (x_test, y_test)


# #############################################################################
# 2. Federation of the pipeline with Flower
# #############################################################################

# Get partition id
parser = argparse.ArgumentParser(description="Flower")
parser.add_argument(
    "--partition-id",
    choices=[0, 1, 2],
    required=True,
    type=int,
    help="Partition of the dataset divided into 3 iid partitions created artificially.",
)
partition_id = parser.parse_args().partition_id

# Load model and data (simple CNN, CIFAR-10)
net = Net().to(DEVICE)
trainloader, testloader = load_data(partition_id=partition_id)

# Define Flower client
class FlowerClient(fl.client.NumPyClient):
    def get_parameters(self, config):
        return [val.cpu().numpy() for _, val in net.state_dict().items()]

    def set_parameters(self, parameters):
        params_dict = zip(net.state_dict().keys(), parameters)
        state_dict = OrderedDict({k: torch.tensor(v) for k, v in params_dict})
        net.load_state_dict(state_dict, strict=True)

    def fit(self, parameters, config):
        self.set_parameters(parameters)
        train(net, trainloader, epochs=10)
        return self.get_parameters(config={}), len(trainloader[0]), {}  # Use len(x_train) or len(y_train)


    def evaluate(self, parameters, config):
        self.set_parameters(parameters)
        loss, accuracy = test(net, testloader)
        return loss, len(testloader[0]), {"accuracy": accuracy}
    
    def save_model(self, model_path="global_model.pth"):
        torch.save(net.state_dict(), model_path)
        print(f"Model saved to {model_path}")


# Start Flower client
fl.client.start_client(
    server_address="127.0.0.1:8080",
    client=FlowerClient().to_client(),
)