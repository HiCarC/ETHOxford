from fastapi import FastAPI
import torch
import torch.nn as nn
import numpy as np

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
    
votre_modele = Net()

# Chargez les poids depuis le fichier NPZ
weights_path = 'models/round-10-weights.npz'
weights_npz = np.load(weights_path)

# Transférez les poids du fichier NPZ vers le modèle PyTorch
with torch.no_grad():
    for name, param in votre_modele.named_parameters():
        if name in weights_npz:
            param.copy_(torch.from_numpy(weights_npz[name]))


app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Bienvenue sur votre service de modèle avec FastAPI et PyTorch."}


@app.post("/predict")
def predict(data: dict):
    input_data = torch.tensor(
        [
            data["BMI"], data["Smoking"], data["AlcoholDrinking"], data["Stroke"], data["PhysicalHealth"], 
            data["MentalHealth"], data["DiffWalking"], data["Sex"], data["AgeCategory"], data["Race"], 
            data["Diabetic"], data["PhysicalActivity"], data["GenHealth"], data["SleepTime"], data["Asthma"], 
            data["KidneyDisease"], data["SkinCancer"]
        ]
    , dtype=torch.float32)

    # Effectuez la prédiction avec votre modèle PyTorch
    with torch.no_grad():
        prediction = votre_modele(input_data).item()
    
    response = "Yes" if prediction > 0.5 else "No"

    if response == "Yes": 
        return "I am sorry to anounce you that you might have cancer diseace"
    
    else: 
        return "You are in great shape. STAY HARD"

    return {"prediction": {response, prediction}}
