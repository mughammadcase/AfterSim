// The main game logic for UncLife, handles the game loop, user input, and CLI display

import readline from "readline";
import { Player } from "./player.js";
import { triggerRandomEvents } from "./events.js";

export function startGame() {
  console.clear();

  const player = new Player();

  // Stores messages displayed during current month and cleared when advancing to next month
  let monthlyMessages = [];

  // Node.js CLI input interface using readline module
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log("Welcome to UncLife!");

  function showMenu() {
    console.log("\nWhat do you do this month?");
    console.log("1. Scavenge");
    console.log("2. Rest");
    console.log("3. Use Supplies");
    console.log("4. Wait");
  }

  /**
   *
   * @param {*} choice
   * @returns
   */
  function handleChoice(choice) {
    switch (choice) {
      case "1": // Scavenge
        monthlyMessages.push("You went scavenging...");

        // Small guaranteed gain
        player.supplies.food += 1;

        //risk
        player.health -= 5;
        player.radiation += 3;

        return true;

      case "2": // Rest
        monthlyMessages.push("You took time to rest.");

        player.health += 5;
        player.morale += 3;

        return true;

      case "3": // Use Supplies
        monthlyMessages.push("You used your supplies.");

        if (player.supplies.food > 0) {
          player.supplies.food--;
          player.hunger -= 20;
        } else {
          monthlyMessages.push("You have no food...");
          player.morale -= 5;
        }

        return true;

      case "4": // Wait
        monthlyMessages.push("You wait. The world moves on...");

        // No benefits as time pressure affects player
        return true;

      default:
        console.log("Invalid choice. Please select a valid option.");
        return false;
    }
  }

  // Main game loop, responsible for checking death condition, displaying stats and menu, and input flow of every month
  function gameLoop() {
    console.clear();
    displayPlayerStats(player, monthlyMessages);

    // Death condition
    if (player.health <= 0) {
      console.log("\nYou neglected yourself for too long.");
      console.log(`You died at age ${player.age}.`);
      console.log("Game Over.");

      rl.close();
      return;
    }

    showMenu();
    askForChoice();
  } // Main game loop, check's death condition, display stats, shows menu and handle user input each month

  // Collects player input, validates choice, triggers random events, age up, and continues game loop
  function askForChoice() {
    rl.question("Enter your choice: ", (answer) => {
      const isValidChoice = handleChoice(answer);

      if (!isValidChoice) {
        return askForChoice();
      }

      // 30% chance to trigger random life event
      const eventTriggered = Math.random() < 0.3;

      if (eventTriggered) {
        triggerRandomEvents(player, monthlyMessages);
      }

      // Adance game time by 1 month
      player.ageUp();

      // Display month summary before advancing
      console.clear();
      displayPlayerStats(player, monthlyMessages);

      rl.question("\nPress Enter to continue...", () => {
        monthlyMessages = [];
        gameLoop();
      }); // Resets monthly message then continues game loop when player press "Enter"
    });
  }

  // gameloop starts here, ensures all functions are defined before starting the game
  gameLoop();

  // The UI display function, this is where all stats and feedback are displayed
  function displayPlayerStats(player, monthlyMessages) {
    console.log("==================================================");
    console.log(
      ` AGE ${player.age} | YEAR ${player.year} | MONTH ${player.month}`,
    );
    console.log("--------------------------------------------------");

    console.log(
      ` HEALTH: ${String(player.health).padEnd(3)}   MORALE: ${String(
        player.morale,
      ).padEnd(3)}   HUNGER: ${String(player.hunger).padEnd(3)}`,
    );

    console.log(
      ` RADIATION: ${String(player.radiation).padEnd(3)}   REPUTATION: ${String(
        player.reputation,
      ).padEnd(3)}`,
    );

    console.log("\n SUPPLIES:"); // Introduce a new economy layer

    console.log(
      ` FOOD: ${player.supplies.food}   WATER: ${player.supplies.water}   MED: ${player.supplies.medicine}   AMMO: ${player.supplies.ammo}`,
    );

    console.log("==================================================");
    console.log("\n[ Life Events & Monthly Feedback ]\n");

    if (monthlyMessages.length === 0) {
      console.log("  Nothing significant happened.");
    } else {
      monthlyMessages.forEach((msg) => {
        console.log(" - " + msg);
      });
    }

    console.log("\n--------------------------------------------------");
  }
}
