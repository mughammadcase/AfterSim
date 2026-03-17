export class Player {
  constructor() {
    this.age = 25;
    this.month = 1;
    this.year = 1;

    this.health = 100;
    this.hunger = 20; // Starts slightly hungry (prevents idle safety)
    this.radiation = 0; // long-term environmental danger
    this.morale = 70; // happiness becomes mental stability
    this.reputation = 0; //  how the world reacts to you, pot. affect trading,  interactions, and opportunities

    this.supplies = {
      food: 3,
      water: 3,
      medicine: 1,
      tools: 1,
      ammo: 5,
    };

    this.alive = true;
  }

  ageUp() {
    this.month++;

    if (this.month > 12) {
      this.month = 1;
      this.year++;
      this.age++;
    } // Age up the Unc and updates each year after 12 months

    // == Survival pressures increase with time ==
    this.hunger += 10;
    this.morale -= 2;

    // == Starvation affects health ==
    if (this.hunger > 80) {
      this.health -= 5;
    }

    // == Radiation affects health ==
    if (this.radiation > 50) {
      this.health -= 3;
    }

    this.clampStats();
  }

  /**
   * Ensures all stats stay within the valid range of 0 to 100
   * Prevents unrealistic values mantaining game balance
   *
   * @returns {void}
   */
  clampStats() {
    if (this.health > 100) this.health = 100;
    if (this.health < 0) this.health = 0;

    if (this.hunger > 100) this.hunger = 100;
    if (this.hunger < 0) this.hunger = 0;

    if (this.radiation > 100) this.radiation = 100;
    if (this.radiation < 0) this.radiation = 0;

    if (this.morale > 100) this.morale = 100;
    if (this.morale < 0) this.morale = 0;

    if (this.reputation > 100) this.reputation = 100;
    if (this.reputation < 0) this.reputation = 0;
  }
}
