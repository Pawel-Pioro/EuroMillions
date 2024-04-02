from rest_framework.response import Response
from rest_framework.decorators import api_view

from django.views.decorators.csrf import csrf_exempt

import random
import json

@csrf_exempt
@api_view(['GET'])
def generateNumbers(request):
    normalChoice = random.sample(range(1, 51), 5)
    starChoice = random.sample(range(1, 13), 2)

    normalChoice.sort()
    starChoice.sort()
    return Response({"normalChoice": normalChoice, "starChoice": starChoice})

@csrf_exempt
@api_view(['POST'])
def returnResult(request):
    data = json.loads(request.body)

    generatedNumbers = data.get('generatedNumbers')
    chosenNumbers = data.get('chosenNumbers')

    guessedNormalNums = 0
    guessedStarNums = 0

    correctlyGuessedNumbers = {
        "normal": [],
        "star": []
    }

    payout = 0.00

    payoutValues = {
        "2 + 0": 2.70,
        "2 + 1": 4.23,
        "1 + 2": 5.39,
        "3 + 0": 6.84,
        "3 + 1": 8.29,
        "2 + 2": 10.85,
        "4 + 0": 31.46,
        "3 + 2": 51.32,
        "4 + 1": 93.86,
        "4 + 2": 1447.08,
        "5 + 0": 26166.77,
        "5 + 1": 260147.51,
        "5 + 2": 57577899.13
    }
    
    for generatedNormalNumber in generatedNumbers["normal"]:
        if generatedNormalNumber in chosenNumbers["normal"]:
            correctlyGuessedNumbers["normal"].append(generatedNormalNumber)
            guessedNormalNums += 1

    for generatedStarNumber in generatedNumbers["star"]:
        if generatedStarNumber in chosenNumbers["star"]:
            correctlyGuessedNumbers["star"].append(generatedStarNumber)
            guessedStarNums += 1

    if f"{guessedNormalNums} + {guessedStarNums}" in payoutValues:
        payout = payoutValues[f"{guessedNormalNums} + {guessedStarNums}"]

    return Response({
        "correctNums": {
            "normal": correctlyGuessedNumbers["normal"],
            "star": correctlyGuessedNumbers["star"]
        },
        "winningNums": {
            "normal": guessedNormalNums,
            "star": guessedStarNums
        },
        "payout": payout	
    })