import readline from "readline"; // User input handling
import { Player } from "./player.js"; // Import the Player class from player.js
import { triggerRandomEvents } from "./events.js"; // Import random events logic from events.js

export function startGame() {
  console.clear();

  const player = new Player(); // Create a new player instance

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  }); // Simple readline interface for user input

  console.log("Welcome to UncLife!");

  function showMenu() {
    console.log("\nWhat do you do this month?");
    console.log("1. Work overtime");
    console.log("2. Exercise");
    console.log("3. Relax");
    console.log("4. Do nothing");
  }

  function handleChoice(choice) {
    switch (choice) {
      case "1":
        player.money += 200;
        player.health -= 5;
        player.discipline += 2;
        return true;

      case "2":
        player.health += 5;
        player.happiness += 3;
        return true;

      case "3":
        player.happiness += 5;
        player.discipline -= 3;
        return true;

      case "4":
        console.log(
          "You let the month pass without doing anything. Time flies...",
        );
        return true;

      default:
        console.log("Invalid choice. Please select a valid option.");
        return false;
    }
  }

  function gameLoop() {
    console.clear();
    displayPlayerStats(player);

    // Check for death conditions
    if (player.health <= 0) {
      console.log("\nYou neglected yourself for too long.");
      console.log(`You died at age ${player.age}.`);
      console.log("Game Over.");

      rl.close(); //fixes node still waiting for input after game ends
      return; // Exits the game loop and prevents menu from showing again
    }

    showMenu();
    askforChoice();
  }

  function askforChoice() {
    rl.question("Enter your choice: ", (answer) => {
      const isValidChoice = handleChoice(answer);

      if (!isValidChoice) {
        return askforChoice();
      }

      const eventTriggered = Math.random() < 0.3;

      if (eventTriggered) {
        triggerRandomEvents(player);
      }

      player.ageUp();

      rl.question("\nPress Enter to continue...", () => {
        gameLoop();
      });
    });
  }

  gameLoop(); // The main game loop

  function displayPlayerStats(player) {
    console.log("==================================================");
    console.log(
      ` AGE ${player.age} | YEAR ${player.year} | MONTH ${player.month}`,
    );
    console.log("--------------------------------------------------");

    console.log(
      ` HEALTH: ${String(player.health).padEnd(3)}   HAPPINESS: ${String(
        player.happiness,
      ).padEnd(3)}   DISCIPLINE: ${String(player.discipline).padEnd(3)}`,
    );

    console.log(
      ` MONEY: $${String(player.money).padEnd(5)}   REPUTATION: ${String(
        player.reputation,
      ).padEnd(3)}`,
    );

    console.log("==================================================");
    console.log("\n[ Message Area ]\n"); // The life event and consequences will be displayed here
    console.log("==================================================");
  }
}
