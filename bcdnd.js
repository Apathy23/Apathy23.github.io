const BCDnDVersion = "0.0.2";

async function runBCDnD() {
    // Bondage Club Mod Development Kit (1.2.0) initialization code here...

    const modAPI = bcModSdk.registerMod({
        name: 'BCDnD',
        fullName: 'Bondage Club Dungeons and Dragons',
        version: BCDnDVersion,
        repository: 'https://github.com/apathy23/bcdnd',
    });

    // Classes
    class Restraint {
        constructor(name, slot, color, lock, difficulty, craftName, craftDescription, itemTypeRecord) {
            this.name = name;
            this.slot = slot;
            this.color = color;
            this.lock = lock;
            this.difficulty = difficulty;
            this.craftName = craftName;
            this.craftDescription = craftDescription;
            this.itemTypeRecord = itemTypeRecord;
        }
    }

    class Trap {
        constructor(name, dialog, position, restraints, active = true, cooldown = 5000) {
            this.name = name;
            this.dialog = dialog;
            this.position = position;
            this.restraints = restraints;
            this.isActive = active;
            this.cooldown = cooldown;
            this.lastTrigger = 0;
        }

        canTrigger() {
            return this.isActive && (Date.now() - this.lastTrigger) > this.cooldown;
        }

        trigger() {
            this.isActive = false;
            this.lastTrigger = Date.now();
        }

        reset() {
            if (Date.now() - this.lastTrigger > this.cooldown) {
                this.isActive = true;
            }
        }
    }

    class Zone {
        constructor(name, topLeft, bottomRight) {
            this.name = name;
            this.topLeft = topLeft;
            this.bottomRight = bottomRight;
        }

        containsPoint(x, y) {
            return x >= this.topLeft.X && x <= this.bottomRight.X &&
                   y >= this.topLeft.Y && y <= this.bottomRight.Y;
        }
    }

    class ZoneManager {
        constructor() {
            this.zones = new Map();
        }

        addZone(zone) {
            this.zones.set(zone.name, zone);
        }

        getZone(x, y) {
            for (const zone of this.zones.values()) {
                if (zone.containsPoint(x, y)) {
                    return zone;
                }
            }
            return null;
        }
    }

    // Global variables
    const dndTrapMap = new Map();
    const asylumTrapMap = new Map();
    const collaredPlayers = new Map();
    const zoneManager = new ZoneManager();
    let currentMode = "off";

    // Helper functions
    function applyRestraint(character, trapName, trapSlot, color, difficulty, craft, lock) {
        InventoryWear(character, trapName, trapSlot, color, difficulty, character.ID, craft, true);
        if (lock) {
            const item = InventoryGet(character, trapSlot);
            if (item && item.Asset.AllowLock) {
                InventoryLock(character, item, lock, Player.MemberNumber, false);
                console.log(`Locked ${trapName} on ${character.Name} with ${lock}`);
            } else {
                console.log(`Cannot lock ${trapName} on ${trapSlot}`);
            }
        }
        ChatRoomCharacterUpdate(character);
    }

    function addTrap(trapMap, trap) {
        const key = `${trap.position.X},${trap.position.Y}`;
        if (!trapMap.has(key)) {
            trapMap.set(key, []);
        }
        trapMap.get(key).push(trap);
    }

    function checkTraps(trapMap) {
        for (const [positionKey, traps] of trapMap.entries()) {
            const [x, y] = positionKey.split(',').map(Number);
            for (const C of ChatRoomCharacter) {
                if (C.MapData && C.MapData.Pos.X === x && C.MapData.Pos.Y === y) {
                    for (const trap of traps) {
                        trap.reset();
                        if (trap.canTrigger()) {
                            let restraintsApplied = false;
                            for (const restraint of trap.restraints) {
                                if (!InventoryGet(C, restraint.slot)) {
                                    applyRestraint(C, restraint.name, restraint.slot, restraint.color, restraint.difficulty, null, restraint.lock);
                                    restraintsApplied = true;
                                }
                            }
                            if (restraintsApplied) {
                                ServerSend("ChatRoomChat", { Content: trap.dialog, Type: "Emote", Target: C.MemberNumber });
                                ChatRoomCharacterUpdate(C);
                                trap.trigger();
                            }
                        }
                    }
                }
            }
        }
    }

    function trackCollaredPatients() {
        for (const C of ChatRoomCharacter) {
            const collar = InventoryGet(C, "ItemNeck");
            if (collar?.Asset.Name === "Asylum Collar") {
                const currentZone = zoneManager.getZone(C.MapData.Pos.X, C.MapData.Pos.Y);
                collaredPlayers.set(C.MemberNumber, {
                    position: C.MapData.Pos,
                    zone: currentZone ? currentZone.name : null,
                    designatedZone: collaredPlayers.get(C.MemberNumber)?.designatedZone || "LowSecurity"
                });
                checkPlayerZone(C);
            } else {
                collaredPlayers.delete(C.MemberNumber);
            }
        }
    }

    function checkPlayerZone(C) {
        const playerInfo = collaredPlayers.get(C.MemberNumber);
        if (playerInfo) {
            const currentZone = zoneManager.getZone(C.MapData.Pos.X, C.MapData.Pos.Y);
            if (currentZone && currentZone.name !== playerInfo.designatedZone) {
                ServerSend("ChatRoomChat", { 
                    Content: `Warning: You are in ${currentZone.name}, which is outside your designated ${playerInfo.designatedZone} zone. Please return immediately or face consequences.`, 
                    Type: "Whisper", 
                    Target: C.MemberNumber 
                });
                // TODO: Implement punishments here
            }
        }
    }

    // Main loops
    function dndMainLoop() {
        checkTraps(dndTrapMap);
    }

    function asylumMainLoop() {
        checkTraps(asylumTrapMap);
        trackCollaredPatients();
    }

    function BCDnDMainLoop() {
        if (!isInValidLocation() || currentMode === "off") return;

        if (currentMode === "dnd") {
            dndMainLoop();
        } else if (currentMode === "asylum") {
            asylumMainLoop();
        }
    }

    // Utility functions
    function isInValidLocation() {
        const validRooms = ["AsylumEntrance", "AsylumBedroom", "AsylumTherapy", "AsylumMeeting"];
        return validRooms.includes(Player.LastChatRoom);
    }

    // Initialization
    function initializeZones() {
        const lowSecurity = new Zone("LowSecurity", {X: 0, Y: 0}, {X: 10, Y: 10});
        const mediumSecurity = new Zone("MediumSecurity", {X: 11, Y: 0}, {X: 20, Y: 10});
        const highSecurity = new Zone("HighSecurity", {X: 21, Y: 0}, {X: 30, Y: 10});

        zoneManager.addZone(lowSecurity);
        zoneManager.addZone(mediumSecurity);
        zoneManager.addZone(highSecurity);
    }

    function initializeTraps() {
        const wristShackles = new Restraint("WristShackles", "ItemArms", "", "HighSecurityPadlock", 5);
        const ankleShackles = new Restraint("AnkleShackles", "ItemFeet", "", "HighSecurityPadlock", 5);
        const leatherCollar = new Restraint("LeatherCollar", "ItemNeck", "", "HighSecurityPadlock", 5);

        const complexTrap = new Trap(
            "Enslaving Trap", 
            "As you step on the trap you hear springs go off and feel the cold hard feeling of steel wrapping around your wrists and ankles as you get shackled.", 
            { X: 20, Y: 21 }, 
            [ankleShackles, leatherCollar, wristShackles], 
            true
        );

        addTrap(dndTrapMap, complexTrap);
        addTrap(asylumTrapMap, complexTrap);
    }

    // Public API
    window.BCDnD = window.BCDnD || {};

    BCDnD.switchMode = function(mode) {
        if (["dnd", "asylum", "off"].includes(mode)) {
            currentMode = mode;
            console.log(`Switched to ${mode} mode`);
        } else {
            console.log("Invalid mode. Use 'dnd', 'asylum', or 'off'");
        }
    };

    BCDnD.addTrap = function(mode, trap) {
        const trapMap = mode === "dnd" ? dndTrapMap : asylumTrapMap;
        addTrap(trapMap, trap);
    };

    BCDnD.setDesignatedZone = function(memberNumber, zoneName) {
        const playerInfo = collaredPlayers.get(memberNumber);
        if (playerInfo) {
            playerInfo.designatedZone = zoneName;
            console.log(`Set designated zone for ${memberNumber} to ${zoneName}`);
        } else {
            console.log(`Player ${memberNumber} is not collared or not found`);
        }
    };

    // Initialization and hooks
    initializeZones();
    initializeTraps();

    modAPI.hookFunction('TimerProcess', 2, (args, next) => { 
        BCDnDMainLoop();
        next(args);
    });

    modAPI.hookFunction('ChatRoomSync', 0, (args, next) => {
        const result = next(args);
        if (isInValidLocation()) {
            BCDnD.switchMode("asylum"); // or "dnd" depending on your preference
        } else {
            BCDnD.switchMode("off");
        }
        return result;
    });
}

runBCDnD();