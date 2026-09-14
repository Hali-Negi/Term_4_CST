
// Author: Hali Imanpanah
// Student ID: A01424306
// ChatGPT was used as a learning and coding assistant for a few methods in userinterface and memorybutton classes.

import { STRINGS } from "../lang/messages/en/user.js";


// Handles the user interface and page elements.
class UserInterface {

    // Gets the HTML elements needed for the game.
    constructor() {

        this.questionLabel    = document.getElementById("question-label");
        this.buttonCountInput = document.getElementById("button-count");
        this.goButton         = document.getElementById("go-button");
        this.gameArea         = document.getElementById("game-area");
        this.gameMessage      = document.getElementById("game-message");   
        
    }

    // Displays the page title, question, and Go button text.
    setText() {
        document.title                 = STRINGS.PAGE_TITLE;
        this.questionLabel.textContent = STRINGS.QUESTION;
        this.goButton.textContent      = STRINGS.GO_BUTTON;
    }

    // Shows a game message to the user.
    showMessage(message) {
        this.gameMessage.textContent = message;
    }

    // Removes the previous game message.
    clearMessage() {
        this.gameMessage.textContent = "";
    }

    // Gets the number entered by the user.
    getButtonCount() {
        return Number(this.buttonCountInput.value);
    }

     // Checks if the number is between 3 and 7.
    isValidButtonCount(count) {
        return count >= 3 && count <= 7;
    }

    // Runs a function when the Go button is clicked.
    onGoClick(callback) {
        this.goButton.addEventListener("click", callback);
    }
}




// Represents one button in the memory game.
class MemoryButton {
    // Creates a button with a number and color.
    constructor(number, color) {

        this.number  = number;
        this.color   = color;
        this.element = document.createElement("button");
        this.element.classList.add("memory-button");
        this.element.textContent           = this.number;
        this.element.style.backgroundColor = this.color;
    }

    // Returns the button HTML element.
    getElement() {
        return this.element;
    }

    // Moves the button to a new position.
    setPosition(x, y) {
        this.element.style.position = "absolute";
        this.element.style.left     = `${x}px`;
        this.element.style.top      = `${y}px`;
    }

    // Hides the button number.
    hideNumber() {
        this.element.textContent = "";
    }

    // Shows the button number.
    showNumber() {
        this.element.textContent = this.number;
    }

     // Runs a function when this button is clicked.
    onClick(callback) {
        this.element.addEventListener("click", callback);
    }
}



// Controls the memory game rules and sequence.
// this.userInterface gives the game access to the page/interface.
// this.buttons = [] creates an empty array where the game will later store all the MemoryButton objects.

class Game {
    // Sets the starting values for the game.
    constructor(userInterface) {
        this.userInterface      = userInterface;
        this.buttons            = [];
        this.nextExpectedNumber = 1;
        this.gameOver           = false;
        this.runId              = 0;
    }

    //clears the buttons from JavaScript memory/array, while leaving the buttons on the page.
    clearGame() {
        this.runId++;
        this.buttons = [];
        this.userInterface.gameArea.innerHTML = "";

        this.nextExpectedNumber = 1;
        this.gameOver           = false;
    }

    // Creates a random color.
    getRandomColor() {
        const randomNumber = Math.floor(Math.random() * 16777215);
        return `#${randomNumber.toString(16).padStart(6, "0")}`;
    }

    // Creates a random position.
    getRandomPosition(max) {
        return Math.floor(Math.random() * max);
    }
    

    // Creates the buttons and runs the game sequence.
    async createButtons(count) {
        const currentRunId = this.runId;
    
        for (let i = 1; i <= count; i++) {
            const button = new MemoryButton(i, this.getRandomColor());
    
            this.buttons.push(button);
            this.userInterface.gameArea.appendChild(button.getElement());
        }
    
        await this.delay(count * 1000);
    
        if (currentRunId !== this.runId) {
            return;
        }
    
        for (let i = 0; i < count; i++) {
            this.scrambleButtons();
        
            await this.delay(2000);
        
            if (currentRunId !== this.runId) {
                return;
            }
        }
        
        this.hideNumbers();
        this.enableButtonClicks();
    }

     // Moves all buttons to random positions.
    scrambleButtons() {
        this.buttons.forEach((button) => {
            const maxX = window.innerWidth;
            const maxY = window.innerHeight;
    
            const buttonWidth  = button.getElement().offsetWidth;
            const buttonHeight = button.getElement().offsetHeight;

            const x = this.getRandomPosition(maxX - buttonWidth);
            const y = this.getRandomPosition(maxY - buttonHeight);
    
            button.setPosition(x, y);
        });
    }

    // Hides all button numbers.
    hideNumbers() {
        this.buttons.forEach((button) => {
            button.hideNumber();
        });
    }

     // Makes the buttons clickable and checks the order.
    enableButtonClicks() {
        this.buttons.forEach((button) => {
            button.onClick(() => {
                if (this.gameOver) {
                    return;
                }

                if (button.number === this.nextExpectedNumber) {
                    button.showNumber();
                    this.nextExpectedNumber++;

                    if (this.nextExpectedNumber > this.buttons.length) {
                        this.gameOver = true;
                        this.userInterface.showMessage(STRINGS.EXCELLENT_MEMORY);
                        
                    }
                } else {
                    this.buttons.forEach((currentButton) => {
                        currentButton.showNumber();
                    });
                    
                    this.gameOver = true;
                    this.userInterface.showMessage(STRINGS.WRONG_ORDER);
                }
            });
        });
    }


    // Waits for a given amount of time.
    delay(milliseconds) {
        return new Promise((resolve) => {
            setTimeout(resolve, milliseconds);
        });
    }
}





// Create the user interface and game objects.
const userInterface = new UserInterface();
userInterface.setText();

// Game.createButtons(3) → loop runs 3 times → creates 3 MemoryButton objects → stores them in the array → 
// displays them on the page.
const game = new Game(userInterface);


// Start a new game when the Go button is clicked.
userInterface.onGoClick(() => {
    const count = userInterface.getButtonCount();

    if (userInterface.isValidButtonCount(count)) {
        game.clearGame();
        userInterface.clearMessage();
        game.createButtons(count);
    } else {
        alert(STRINGS.INVALID_COUNT);
    }
});


