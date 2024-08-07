const BCDnDVersion = "0.0.2";

async function runBCDnD() {
    // Bondage Club Mod Development Kit (1.2.0)
	// For more info see: https://github.com/Jomshir98/bondage-club-mod-sdk
	/** @type {ModSDKGlobalAPI} */
	var bcModSdk=function(){"use strict";const o="1.2.0";function e(o){alert("Mod ERROR:\n"+o);const e=new Error(o);throw console.error(e),e}const t=new TextEncoder;function n(o){return!!o&&"object"==typeof o&&!Array.isArray(o)}function r(o){const e=new Set;return o.filter((o=>!e.has(o)&&e.add(o)))}const i=new Map,a=new Set;function c(o){a.has(o)||(a.add(o),console.warn(o))}function s(o){const e=[],t=new Map,n=new Set;for(const r of f.values()){const i=r.patching.get(o.name);if(i){e.push(...i.hooks);for(const[e,a]of i.patches.entries())t.has(e)&&t.get(e)!==a&&c(`ModSDK: Mod '${r.name}' is patching function ${o.name} with same pattern that is already applied by different mod, but with different pattern:\nPattern:\n${e}\nPatch1:\n${t.get(e)||""}\nPatch2:\n${a}`),t.set(e,a),n.add(r.name)}}e.sort(((o,e)=>e.priority-o.priority));const r=function(o,e){if(0===e.size)return o;let t=o.toString().replaceAll("\r\n","\n");for(const[n,r]of e.entries())t.includes(n)||c(`ModSDK: Patching ${o.name}: Patch ${n} not applied`),t=t.replaceAll(n,r);return(0,eval)(`(${t})`)}(o.original,t);let i=function(e){var t,i;const a=null===(i=(t=m.errorReporterHooks).hookChainExit)||void 0===i?void 0:i.call(t,o.name,n),c=r.apply(this,e);return null==a||a(),c};for(let t=e.length-1;t>=0;t--){const n=e[t],r=i;i=function(e){var t,i;const a=null===(i=(t=m.errorReporterHooks).hookEnter)||void 0===i?void 0:i.call(t,o.name,n.mod),c=n.hook.apply(this,[e,o=>{if(1!==arguments.length||!Array.isArray(e))throw new Error(`Mod ${n.mod} failed to call next hook: Expected args to be array, got ${typeof o}`);return r.call(this,o)}]);return null==a||a(),c}}return{hooks:e,patches:t,patchesSources:n,enter:i,final:r}}function l(o,e=!1){let r=i.get(o);if(r)e&&(r.precomputed=s(r));else{let e=window;const a=o.split(".");for(let t=0;t<a.length-1;t++)if(e=e[a[t]],!n(e))throw new Error(`ModSDK: Function ${o} to be patched not found; ${a.slice(0,t+1).join(".")} is not object`);const c=e[a[a.length-1]];if("function"!=typeof c)throw new Error(`ModSDK: Function ${o} to be patched not found`);const l=function(o){let e=-1;for(const n of t.encode(o)){let o=255&(e^n);for(let e=0;e<8;e++)o=1&o?-306674912^o>>>1:o>>>1;e=e>>>8^o}return((-1^e)>>>0).toString(16).padStart(8,"0").toUpperCase()}(c.toString().replaceAll("\r\n","\n")),d={name:o,original:c,originalHash:l};r=Object.assign(Object.assign({},d),{precomputed:s(d),router:()=>{},context:e,contextProperty:a[a.length-1]}),r.router=function(o){return function(...e){return o.precomputed.enter.apply(this,[e])}}(r),i.set(o,r),e[r.contextProperty]=r.router}return r}function d(){for(const o of i.values())o.precomputed=s(o)}function p(){const o=new Map;for(const[e,t]of i)o.set(e,{name:e,original:t.original,originalHash:t.originalHash,sdkEntrypoint:t.router,currentEntrypoint:t.context[t.contextProperty],hookedByMods:r(t.precomputed.hooks.map((o=>o.mod))),patchedByMods:Array.from(t.precomputed.patchesSources)});return o}const f=new Map;function u(o){f.get(o.name)!==o&&e(`Failed to unload mod '${o.name}': Not registered`),f.delete(o.name),o.loaded=!1,d()}function g(o,t){o&&"object"==typeof o||e("Failed to register mod: Expected info object, got "+typeof o),"string"==typeof o.name&&o.name||e("Failed to register mod: Expected name to be non-empty string, got "+typeof o.name);let r=`'${o.name}'`;"string"==typeof o.fullName&&o.fullName||e(`Failed to register mod ${r}: Expected fullName to be non-empty string, got ${typeof o.fullName}`),r=`'${o.fullName} (${o.name})'`,"string"!=typeof o.version&&e(`Failed to register mod ${r}: Expected version to be string, got ${typeof o.version}`),o.repository||(o.repository=void 0),void 0!==o.repository&&"string"!=typeof o.repository&&e(`Failed to register mod ${r}: Expected repository to be undefined or string, got ${typeof o.version}`),null==t&&(t={}),t&&"object"==typeof t||e(`Failed to register mod ${r}: Expected options to be undefined or object, got ${typeof t}`);const i=!0===t.allowReplace,a=f.get(o.name);a&&(a.allowReplace&&i||e(`Refusing to load mod ${r}: it is already loaded and doesn't allow being replaced.\nWas the mod loaded multiple times?`),u(a));const c=o=>{let e=g.patching.get(o.name);return e||(e={hooks:[],patches:new Map},g.patching.set(o.name,e)),e},s=(o,t)=>(...n)=>{var i,a;const c=null===(a=(i=m.errorReporterHooks).apiEndpointEnter)||void 0===a?void 0:a.call(i,o,g.name);g.loaded||e(`Mod ${r} attempted to call SDK function after being unloaded`);const s=t(...n);return null==c||c(),s},p={unload:s("unload",(()=>u(g))),hookFunction:s("hookFunction",((o,t,n)=>{"string"==typeof o&&o||e(`Mod ${r} failed to patch a function: Expected function name string, got ${typeof o}`);const i=l(o),a=c(i);"number"!=typeof t&&e(`Mod ${r} failed to hook function '${o}': Expected priority number, got ${typeof t}`),"function"!=typeof n&&e(`Mod ${r} failed to hook function '${o}': Expected hook function, got ${typeof n}`);const s={mod:g.name,priority:t,hook:n};return a.hooks.push(s),d(),()=>{const o=a.hooks.indexOf(s);o>=0&&(a.hooks.splice(o,1),d())}})),patchFunction:s("patchFunction",((o,t)=>{"string"==typeof o&&o||e(`Mod ${r} failed to patch a function: Expected function name string, got ${typeof o}`);const i=l(o),a=c(i);n(t)||e(`Mod ${r} failed to patch function '${o}': Expected patches object, got ${typeof t}`);for(const[n,i]of Object.entries(t))"string"==typeof i?a.patches.set(n,i):null===i?a.patches.delete(n):e(`Mod ${r} failed to patch function '${o}': Invalid format of patch '${n}'`);d()})),removePatches:s("removePatches",(o=>{"string"==typeof o&&o||e(`Mod ${r} failed to patch a function: Expected function name string, got ${typeof o}`);const t=l(o);c(t).patches.clear(),d()})),callOriginal:s("callOriginal",((o,t,n)=>{"string"==typeof o&&o||e(`Mod ${r} failed to call a function: Expected function name string, got ${typeof o}`);const i=l(o);return Array.isArray(t)||e(`Mod ${r} failed to call a function: Expected args array, got ${typeof t}`),i.original.apply(null!=n?n:globalThis,t)})),getOriginalHash:s("getOriginalHash",(o=>{"string"==typeof o&&o||e(`Mod ${r} failed to get hash: Expected function name string, got ${typeof o}`);return l(o).originalHash}))},g={name:o.name,fullName:o.fullName,version:o.version,repository:o.repository,allowReplace:i,api:p,loaded:!0,patching:new Map};return f.set(o.name,g),Object.freeze(p)}function h(){const o=[];for(const e of f.values())o.push({name:e.name,fullName:e.fullName,version:e.version,repository:e.repository});return o}let m;const y=void 0===window.bcModSdk?window.bcModSdk=function(){const e={version:o,apiVersion:1,registerMod:g,getModsInfo:h,getPatchingInfo:p,errorReporterHooks:Object.seal({apiEndpointEnter:null,hookEnter:null,hookChainExit:null})};return m=e,Object.freeze(e)}():(n(window.bcModSdk)||e("Failed to init Mod SDK: Name already in use"),1!==window.bcModSdk.apiVersion&&e(`Failed to init Mod SDK: Different version already loaded ('1.2.0' vs '${window.bcModSdk.version}')`),window.bcModSdk.version!==o&&alert(`Mod SDK warning: Loading different but compatible versions ('1.2.0' vs '${window.bcModSdk.version}')\nOne of mods you are using is using an old version of SDK. It will work for now but please inform author to update`),window.bcModSdk);return"undefined"!=typeof exports&&(Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=y),y}();

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
            if (collar && collar.Asset.Name === "Nylon Collar" && collar.Craft && collar.Craft.Name === "Asylum Collar") {
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
        if (currentMode === "off") return;

        if (currentMode === "dnd") {
            dndMainLoop();
        } else if (currentMode === "asylum") {
            asylumMainLoop();
        }
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
    
}

runBCDnD();