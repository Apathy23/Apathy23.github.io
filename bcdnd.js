const BCDnDVersion = "0.0.1";

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


    class Trap {
        constructor(name, slot, color, craftName, craftDescription, itemTypeRecord, dialog, lock, difficultyMultiplier, difficultyOffset, difficultyOffset2, position, active) {
            this.name = name;
            this.slot = slot;
            this.color = color;
            this.craftName = craftName;
            this.craftDescription = craftDescription;
            this.itemTypeRecord = itemTypeRecord;
            this.dialog = dialog;
            this.lock = lock;
            this.difficultyMultiplier = difficultyMultiplier;
            this.difficultyOffset = difficultyOffset;
            this.difficultyOffset2 = difficultyOffset2;
            this.position = position;
            this.active = active;
        }
    }

    trapArray = [
        {
            name: "AnkleShackles",
            slot: "ItemFeet",
            color: null,
            craftName: null,
            craftDescription: "",
            itemTypeRecord: {},
            dialog: "As you step on the trap, you feel a sudden weight on your feet. You look down to see a pair of shackles around your ankles.",
            lock: "",
            difficultyMultiplier: 1,
            difficultyOffset: 0,
            difficultyOffset2: 5,
            id: 0,
            position: { X: 11, Y: 10},
            active: true
        },
        {
            name: "Slime",
            slot: "ItemFeet",
            color: null,
            craftName: null,
            craftDescription: "",
            itemTypeRecord: {},
            dialog: "A wet and sticky substance covers your feet as you step on the trap. You feel your feet being pulled down into the ground.",
            lock: "",
            difficultyMultiplier: 1,
            difficultyOffset: 0,
            difficultyOffset2: 5,
            id: 0,
            position: { X: 10, Y: 10},
            active: true
        }
    ];

    /**
     * 
     * @param {ChatRoomCharacter} character 
     * @param {Trap.name} trapName 
     * @param {Trap.slot} trapSlot 
     * @param {Trap.color} color // HEX color
     * @param {Trap.difficulty} difficulty 
     * @param {Trap.craftName} craft
     */
    // TODO: Add craft to the function if craftName is not null
    function applyRestraint(character, trapName, trapSlot, color, difficulty, craft) {
        InventoryWear(character, trapName, trapSlot, color, difficulty, character.ID, craft, true);
        ChatRoomCharacterUpdate(character);
    }

    /*
    * Maps for the dnd and asylum traps to keep them separate
    */
    
    // DnD
    const dndTrapMap = new Map();

    // Asylum
    const asylumTrapMap = new Map();
    const collaredPlayers = new Map();
    
    /**
     * Helper functions to quickly add and remove traps
     * @param {Map} map
     * @param {Trap} trap
     */
    function addDndTrap(position, trap) {
        dndTrapMap.set(position, trap);
    }

    function removeDndTrap(position) {
        dndTrapMap.delete(position);
    }

    function addAsylumTrap(position, trap) {
        asylumTrapMap.set(position, trap);
    }

    function removeAsylumTrap(position) {
        asylumTrapMap.delete(position);
    }

    function checkTrap() {
        if (!Player.MapData) return;
        for (let i = 0; i < trapArray.length; i++) {
            for (let j = 0; j < ChatRoomCharacter.length; j++) {
                if (InventoryGet(ChatRoomCharacter[j], trapArray[i].slot) == null && trapArray[i].active == true) {
                    if (ChatRoomCharacter[j].MapData.Pos.X == trapArray[i].position.X && ChatRoomCharacter[j].MapData.Pos.Y == trapArray[i].position.Y) {
                        InventoryWear(ChatRoomCharacter[j], trapArray[i].name, trapArray[i].slot, trapArray[i].color, 5, ChatRoomCharacter[j].ID, null, true);
                        ServerSend("ChatRoomChat", { Content: trapArray[i].dialog, Type: "Emote", Target: ChatRoomCharacter[j].MemberNumber });
                        ChatRoomCharacterUpdate(ChatRoomCharacter[j]);
                    }
                }
            }
        }
    }

    /*
    * DnD Section
    */
    function dndMainLoop() {
        checkTrap();
    }

    /*
    * END OF DnD SECTION
    */

    /*
    * Asylum Section
    */

    function asylumMainLoop() {
        checkAsylumTraps();
        trackCollaredPatients();
    }

    /**
     * Checks if a character is stepping on an asylum trap
     * and applies the restraint if they are
     * only runs in asylum mode
     */
    function checkAsylumTraps() {
        if (!Player.MapData) return;
        for (const [position, trap] of asylumTrapMap) {
            if (trap.isActive) {
                for (const C of ChatRoomCharacter) {
                    if (C.MapData.Pos.X === trap.position.X && C.MapData.Pos.Y === trap.position.Y) {
                        applyRestraint(C, trap.name, trap.slot, trap.color, 5, null);
                        trap.isActive = false;
                    }
                }
            }
        }
    }

    /**
     * Keeps track of collared patients in the asylum
     * TODO check what zone in the asylum they are in
     */
    function trackCollaredPatients() {
        for (const C of ChatRoomCharacter) {
            if (InventoryGet(C, "ItemNeck")?.Asset.Name === "Asylum Collar") {
                collaredPlayers.set(C.MemberNumber, C.MapData.Pos);
            } else {
                collaredPlayers.delete(C.MemberNumber);
            }
        }
    }

    /**
    * END OF ASYLUM SECTION
    */

    /**
     * Controls which mainloop to run
     */
    let currentMode = "dnd";

    /**
     * Swap betweens dnd and asylum main loops
     * @param {String} mode 
     */
    function switchMode(mode) {
        if (mode === "dnd" || mode === "asylum") {
            currentMode = mode;
            console.log(`Switched to ${mode} mode`);
        } else {
            console.log("Invalid mode. Use 'dnd' or 'asylum'");
        }
    }

    addAsylumTrap(new Trap("AnkleShackles", "ItemFeet", null, null, "", {}, 
        "As you step on the trap, you feel a sudden weight on your feet. You look down to see a pair of shackles around your ankles.", "", 1, 0, 5, { X: 11, Y: 10}, true));

    modAPI.hookFunction('TimerProcess', 2, (args, next) => { 
		if (currentMode === "dnd") {
            dndMainLoop();
        } else if (currentMode === "asylum") {
            asylumMainLoop();
        }
		next(args);
	})
}

runBCDnD();