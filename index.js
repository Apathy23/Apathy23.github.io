console.log("Hello, World!");

let ChatRoomCharacterArray = [];

class Trap {
    constructor(name, assetName, assetGroup, message, isActive, positionX, positionY) {
        this.name = name;
        this.assetName = assetName;
        this.assetGroup = assetGroup;
        this.message = message;
        this.isActive = isActive;
        this.positionX = positionX;
        this.positionY = positionY;
    }

    changeRestraint(newRestraint) {
        this.restraint = newRestraint;
    }

    activate() {
        this.isActive = true;
    }

    deactivate() {
        this.isActive = false;
    }

    move(newPositionX, newPositionY) {
        this.positionX = newPositionX;
        this.positionY = newPositionY;
    }
}

let shackleTrap = new Trap("Shackle Trap", "AnkleShackles", "ItemFeet", "You are shackled.", true, 20, 20);

ChatRoomCharacter.foreach(char => {
    if (!char.Mapdata) return;
    if (char.Mapdata.Pos.X == shackleTrap.positionX && char.Mapdata.Pos.Y == shackleTrap.positionY && shackleTrap.isActive) {
        shackleTrap.deactivate();
        InventoryWear(char, shackleTrap.assetName, shackleTrap.assetGroup, null, 5, 66317, null, true);
        ChatRoomCharacterUpdate(char);
    }
});
