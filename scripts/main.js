(() => {
  var __defProp = Object.defineProperty;
  var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

  // src/module.js
  var MODULE_ID = "anonymous";
  function templatePath(...path) {
    path = path.filter((x) => typeof x === "string");
    return `modules/${MODULE_ID}/templates/${path.join("/")}`;
  }
  __name(templatePath, "templatePath");
  function isGM() {
    const data = game.data;
    const user = data.users.find((x) => x._id === data.userId);
    return !!user && user.role >= CONST.USER_ROLES.GAMEMASTER;
  }
  __name(isGM, "isGM");
  function getFlag(doc, key, fallback) {
    return doc.getFlag(MODULE_ID, key) ?? fallback;
  }
  __name(getFlag, "getFlag");
  function setFlag(doc, key, value) {
    return doc.setFlag(MODULE_ID, key, value);
  }
  __name(setFlag, "setFlag");
  function localize(...args) {
    let [key, data] = args;
    key = `${MODULE_ID}.${key}`;
    if (data)
      return game.i18n.format(key, data);
    return game.i18n.localize(key);
  }
  __name(localize, "localize");
  function subLocalize(subKey) {
    const fn = /* @__PURE__ */ __name((...args) => localize(`${subKey}.${args[0]}`, args[1]), "fn");
    Object.defineProperties(fn, {
      warn: {
        value: (...args) => warn(`${subKey}.${args[0]}`, args[1], args[2]),
        enumerable: false,
        configurable: false
      },
      info: {
        value: (...args) => info(`${subKey}.${args[0]}`, args[1], args[2]),
        enumerable: false,
        configurable: false
      },
      error: {
        value: (...args) => error(`${subKey}.${args[0]}`, args[1], args[2]),
        enumerable: false,
        configurable: false
      },
      has: {
        value: (key) => hasLocalization(`${subKey}.${key}`),
        enumerable: false,
        configurable: false
      },
      path: {
        value: (key) => localizePath(`${subKey}.${key}`),
        enumerable: false,
        configurable: false
      },
      template: {
        value: (key, { hash }) => fn(key, hash),
        enumerable: false,
        configurable: false
      }
    });
    return fn;
  }
  __name(subLocalize, "subLocalize");
  function getSameCombatants(combatant) {
    return combatant.combat.turns.filter((x) => x.actorId === combatant.actorId);
  }
  __name(getSameCombatants, "getSameCombatants");
  function getSetting(key) {
    return game.settings.get(MODULE_ID, key);
  }
  __name(getSetting, "getSetting");
  function setSetting(key, value) {
    return game.settings.set(MODULE_ID, key, value);
  }
  __name(setSetting, "setSetting");
  function getActorSceneTokens(scene, actor, linkedOnly = false) {
    return scene.tokens.filter(
      (token) => token.actorId === actor.id && (!linkedOnly || token.actorLink)
    );
  }
  __name(getActorSceneTokens, "getActorSceneTokens");
  function getActorTokens(actor, linkedOnly = false) {
    return game.scenes.map((scene) => getActorSceneTokens(scene, actor, linkedOnly)).flat();
  }
  __name(getActorTokens, "getActorTokens");
  function capitalize(str) {
    if (!str)
      return "";
    return str[0].toUpperCase() + str.slice(1);
  }
  __name(capitalize, "capitalize");
  function registerSetting(options) {
    const name = options.name;
    options.scope = options.scope ?? "world";
    options.config = options.config ?? false;
    if (options.config) {
      options.name = getSettingLocalizationPath(name, "name");
      options.hint = getSettingLocalizationPath(name, "hint");
    }
    if (Array.isArray(options.choices)) {
      options.choices = options.choices.reduce((choices, choice) => {
        choices[choice] = getSettingLocalizationPath(name, "choices", choice);
        return choices;
      }, {});
    }
    game.settings.register(MODULE_ID, name, options);
  }
  __name(registerSetting, "registerSetting");
  function registerSettingMenu(options) {
    const name = options.name;
    options.name = getSettingLocalizationPath("menus", name, "name");
    options.label = getSettingLocalizationPath("menus", name, "label");
    options.hint = getSettingLocalizationPath("menus", name, "hint");
    options.restricted = options.restricted ?? true;
    options.icon = options.icon ?? "fas fa-cogs";
    game.settings.registerMenu(MODULE_ID, name, options);
  }
  __name(registerSettingMenu, "registerSettingMenu");
  function getSettingLocalizationPath(...path) {
    return `${MODULE_ID}.settings.${path.join(".")}`;
  }
  __name(getSettingLocalizationPath, "getSettingLocalizationPath");
  function getCurrentModule() {
    return game.modules.get(MODULE_ID);
  }
  __name(getCurrentModule, "getCurrentModule");
  function notify(str, arg1, arg2, arg3) {
    const type = typeof arg1 === "string" ? arg1 : "info";
    const data = typeof arg1 === "object" ? arg1 : typeof arg2 === "object" ? arg2 : void 0;
    const permanent = typeof arg1 === "boolean" ? arg1 : typeof arg2 === "boolean" ? arg2 : arg3 ?? false;
    ui.notifications.notify(localize(str, data), type, { permanent });
  }
  __name(notify, "notify");
  function warn(...args) {
    const [str, arg1, arg2] = args;
    notify(str, "warning", arg1, arg2);
  }
  __name(warn, "warn");
  function info(...args) {
    const [str, arg1, arg2] = args;
    notify(str, "info", arg1, arg2);
  }
  __name(info, "info");
  function error(...args) {
    const [str, arg1, arg2] = args;
    notify(str, "error", arg1, arg2);
  }
  __name(error, "error");
  function replaceHTMLText(html, regexp, replacement, addSelf = false) {
    let nodes = html.find("*");
    if (addSelf)
      nodes = nodes.addBack();
    nodes.contents().each((_, el) => {
      if (el.nodeType === Node.TEXT_NODE && el.textContent?.trim()) {
        $(el).replaceWith(el.textContent.replace(regexp, replacement));
      }
    });
  }
  __name(replaceHTMLText, "replaceHTMLText");

  // src/token.js
  function updateActorTokens(actor, showName) {
    if (actor.token)
      changeDisplayName(actor.token, showName);
    else
      getActorTokens(actor, true).forEach((x) => changeDisplayName(x, showName));
  }
  __name(updateActorTokens, "updateActorTokens");
  function renderTokenHUD(hud, html) {
    const actor = hud.object.actor;
    if (!actor || actor.hasPlayerOwner)
      return;
    const toggle = createToggle(actor);
    toggle.addEventListener("click", () => toggleSeeName(actor));
    html.querySelector(".col.right").append(toggle);
  }
  __name(renderTokenHUD, "renderTokenHUD");
  function preCreateToken(token) {
    const actor = token.actor;
    if (!actor || actor?.hasPlayerOwner)
      return;
    const displayName = token.displayName;
    const seeName = playersSeeName(token.actor);
    const shows = isShowing(displayName);
    let swap = displayName;
    if (seeName && !shows && getSetting("token")) {
      swap = swapToShow(displayName);
    } else if (!seeName && shows) {
      swap = swapToHide(displayName);
    }
    if (swap !== displayName) {
      token.updateSource({ displayName: swap });
    }
  }
  __name(preCreateToken, "preCreateToken");
  function createToggle(actor) {
    const tmp = document.createElement("template");
    const toggled = playersSeeName(actor);
    tmp.innerHTML = `<div class="control-icon${toggled ? " active" : ""}" data-action="anonymous-toggle">
    <i class="fa-solid fa-signature" title="${localize("hud.title")}"></i>
</div>`;
    return tmp.content.firstChild;
  }
  __name(createToggle, "createToggle");
  function changeDisplayName(token, showName) {
    if (showName)
      showTokenName(token);
    else
      hideTokenName(token);
  }
  __name(changeDisplayName, "changeDisplayName");
  function showTokenName(token) {
    const displayName = token.displayName;
    if (isShowing(displayName) || !getSetting("token"))
      return;
    let swap = swapToShow(displayName);
    if (swap !== displayName) {
      token.update({ displayName: swap });
    }
  }
  __name(showTokenName, "showTokenName");
  function hideTokenName(token) {
    const displayName = token.displayName;
    if (isHidding(displayName))
      return;
    const swap = swapToHide(displayName);
    token.update({ displayName: swap });
  }
  __name(hideTokenName, "hideTokenName");
  function isHidding(displayName) {
    return !isShowing(displayName);
  }
  __name(isHidding, "isHidding");
  function isShowing(displayName) {
    return displayName === CONST.TOKEN_DISPLAY_MODES.HOVER || displayName === CONST.TOKEN_DISPLAY_MODES.ALWAYS;
  }
  __name(isShowing, "isShowing");
  function swapToHide(displayName) {
    if (displayName === CONST.TOKEN_DISPLAY_MODES.HOVER)
      return CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER;
    if (displayName === CONST.TOKEN_DISPLAY_MODES.ALWAYS)
      return CONST.TOKEN_DISPLAY_MODES.OWNER;
    return displayName;
  }
  __name(swapToHide, "swapToHide");
  function swapToShow(displayName) {
    if (displayName === CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER)
      return CONST.TOKEN_DISPLAY_MODES.HOVER;
    if (displayName === CONST.TOKEN_DISPLAY_MODES.OWNER)
      return CONST.TOKEN_DISPLAY_MODES.ALWAYS;
    return displayName;
  }
  __name(swapToShow, "swapToShow");

  // src/api.js
  function playersSeeName(doc) {
    if (doc instanceof Combatant && doc.actor)
      doc = doc.actor;
    if (doc instanceof Actor && doc.hasPlayerOwner)
      return true;
    return !!getFlag(doc, "showName");
  }
  __name(playersSeeName, "playersSeeName");
  async function toggleSeeName(doc) {
    const showName = !playersSeeName(doc);
    if (doc instanceof Actor || !doc.actor)
      await setFlag(doc, "showName", showName);
    else
      await setFlag(doc.actor, "showName", showName);
    if (canvas.tokens.hud?.rendered)
      canvas.tokens.hud.render();
    const actor = doc instanceof Actor ? doc : doc.actor;
    if (actor)
      updateActorTokens(actor, showName);
    return showName;
  }
  __name(toggleSeeName, "toggleSeeName");
  function getName(doc) {
    const unknown = localize("unknown");
    const type = doc instanceof Actor ? doc.type : doc.actor?.type;
    if (!type)
      return unknown;
    const saved = (getSavedNames()[type] ?? "").trim();
    return saved || formatUnknown(unknown, type);
  }
  __name(getName, "getName");
  function refresh() {
    ui.combat.render();
  }
  __name(refresh, "refresh");
  function getSavedNames() {
    return getSetting("names");
  }
  __name(getSavedNames, "getSavedNames");
  function formatUnknown(unknown, type) {
    return `${unknown} ${capitalize(type)}`;
  }
  __name(formatUnknown, "formatUnknown");

  // src/actor.js
  function getActorDirectoryEntryContext(html, entries) {
    addSelectContextEntry({
      entries,
      defaultData: {
        name: (choice) => localize(`context.${choice}`),
        icon: "fa-solid fa-signature",
        callback: ($li) => {
          const id = $li.attr("data-document-id");
          const actor = game.actors.get(id);
          if (actor)
            toggleSeeName(actor);
        },
        condition: ($li, choice) => {
          const id = $li.attr("data-document-id");
          const actor = game.actors.get(id);
          return !!actor && !actor.hasPlayerOwner && (choice === "show" ? !playersSeeName(actor) : playersSeeName(actor));
        }
      },
      choices: ["show", "hide"]
    });
  }
  __name(getActorDirectoryEntryContext, "getActorDirectoryEntryContext");
  function onActorUpdate(actor, data) {
    let needsRefresh = foundry.utils.getProperty(data, `flags.${MODULE_ID}.showName}`) !== void 0;
    if ("ownership" in data) {
      updateActorTokens(actor, actor.hasPlayerOwner);
      needsRefresh = true;
    }
    if (needsRefresh)
      refresh();
  }
  __name(onActorUpdate, "onActorUpdate");
  function addSelectContextEntry({ entries, choices, defaultData = {} }) {
    if (Array.isArray(choices)) {
      choices = choices.reduce((acc, curr) => {
        acc[curr] = {};
        return acc;
      }, {});
    }
    for (const key in choices) {
      const choice = choices[key];
      const name = choice.name ?? (typeof defaultData.name === "function" ? defaultData.name(key) : defaultData.name) ?? "";
      let icon = choice.icon ?? (typeof defaultData.icon === "function" ? defaultData.icon(key) : defaultData.icon) ?? "";
      if (!$(icon).length) {
        const $icon = $("<i></i>");
        $icon.addClass(icon);
        icon = $icon[0].outerHTML;
      }
      entries.unshift({
        name,
        icon,
        callback: ($li) => {
          if (choice.callback)
            choice.callback($li);
          else if (defaultData.callback)
            defaultData.callback($li, key);
        },
        condition: ($li) => choice.condition?.($li) ?? defaultData.condition?.($li, key) ?? true
      });
    }
  }
  __name(addSelectContextEntry, "addSelectContextEntry");

  // src/apps/names.js
  var AnonymousNamesMenu = class extends FormApplication {
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        id: "anonymous-names-menu",
        title: localize("templates.names.title"),
        template: templatePath("names.html"),
        width: 400
      });
    }
    getData(options) {
      const unknown = localize("unknown");
      const saved = getSavedNames();
      const types = Object.keys(game.system.documentTypes.Actor).map((x) => ({
        type: x,
        value: (saved[x] ?? "").trim(),
        placeholder: formatUnknown(unknown, x)
      }));
      return {
        ...super.getData(options),
        types,
        i18n: subLocalize("templates.names")
      };
    }
    activateListeners(html) {
      super.activateListeners(html);
      html.find("[data-action=cancel]").on("click", () => this.close());
    }
    async _updateObject(event, formData) {
      setSetting("names", formData);
    }
  };
  __name(AnonymousNamesMenu, "AnonymousNamesMenu");

  // src/third/dnd5e.js
  function dnd5ParseChat({ message, $html, isAnonymous, actor }) {
    if (!isAnonymous)
      return;
    if (message.rolls.length && getSetting("criticals")) {
      const critical = game.i18n.localize("DND5E.CriticalHit");
      const powerful = game.i18n.localize("DND5E.PowerfulCritical");
      const regexp = new RegExp(
        ` (\\(([\\w ]*)?(?:${critical}|${powerful})([\\w ]*)?\\))$`,
        "igm"
      );
      const $flavor = $html.find("header .flavor-text");
      if (game.user.isGM)
        replaceHTMLText($flavor, regexp, ' <span class="anonymous-replaced">$1</span>', true);
      replaceHTMLText($flavor, regexp, "", true);
    }
  }
  __name(dnd5ParseChat, "dnd5ParseChat");
  function isDnD3() {
    return game.system.id === "dnd5e" && foundry.utils.isNewerVersion(game.system.version, "2.999.0");
  }
  __name(isDnD3, "isDnD3");

  // src/third/pf2e.js
  function pf2eInitHook(isGM2) {
    registerSetting({
      name: "pf2e.traits",
      type: String,
      default: "never",
      config: true,
      choices: {
        never: getSettingLocalizationPath("pf2e.traits.choices.never"),
        rolls: getSettingLocalizationPath("pf2e.traits.choices.rolls"),
        always: getSettingLocalizationPath("pf2e.traits.choices.always")
      }
    });
  }
  __name(pf2eInitHook, "pf2eInitHook");
  function pf2eReadyHook(isGM2) {
    if (isGM2)
      disableSettings();
  }
  __name(pf2eReadyHook, "pf2eReadyHook");
  function disableSettings() {
    let key = "";
    if (game.settings.settings.has("pf2e.metagame.tokenSetsNameVisibility"))
      key = "metagame.tokenSetsNameVisibility";
    else if (game.settings.settings.has("pf2e.metagame_tokenSetsNameVisibility"))
      key = "metagame_tokenSetsNameVisibility";
    if (!key || !game.settings.get("pf2e", key))
      return;
    const module = getCurrentModule().title;
    const setting = game.i18n.localize("PF2E.SETTINGS.Metagame.TokenSetsNameVisibility.Name");
    game.settings.set("pf2e", key, false);
    warn("pf2e.disabled", { module, setting }, true);
  }
  __name(disableSettings, "disableSettings");
  function pf2eParseChat({ message, isAnonymous, $html }) {
    const isGM2 = game.user.isGM;
    const target = message.target?.actor;
    const criticals = getSetting("criticals");
    const rolls = getSetting("rolls");
    if (target && !target.hasPlayerOwner && !playersSeeName(target)) {
      const $targets = $html.find('.flavor-text .target-dc [data-whose="target"]');
      if ($targets.length) {
        const $target = $targets.first();
        if (isGM2)
          $target.attr("data-visibility", "gm");
        else
          $target.text(localize("pf2e.target", { name: getName(target) }));
      }
    }
    if (!isGM2 && isAnonymous) {
      const traits = getSetting("pf2e.traits");
      if (message.rolls.length) {
        if (rolls) {
          const $tags = $html.find(".flavor-text hr + .tags");
          if ($tags.length) {
            $tags.prev("hr").remove();
            $tags.remove();
          }
          if (criticals) {
            $html.find(".message-content .dice-roll .dice-result .dice-total").css("color", "var(--color-text-dark-primary)");
          }
          if (traits !== "never") {
            $html.find(".flavor-text .tags").remove();
          }
        } else if (traits === "always") {
          $html.find(".flavor-text .tags").first().remove();
        }
      } else if (traits === "always") {
        $html.find(".message-content section.tags").remove();
      }
    }
    if (isAnonymous && message.rolls.length && rolls && criticals) {
      const critical = game.i18n.localize("PF2E.Check.Result.Degree.Attack.criticalSuccess");
      const hit = game.i18n.localize("PF2E.Check.Result.Degree.Attack.success");
      const regex = new RegExp(`(\\((${critical}|${hit})\\))`, "gmi");
      const str = isGM2 ? '<span class="anonymous-replaced">$1</span>' : "";
      const flavor = $html.find("header .flavor-text");
      replaceHTMLText(flavor, regex, str, true);
    }
  }
  __name(pf2eParseChat, "pf2eParseChat");

  // src/third/wire.js
  var SAVE = /\(dc \d+\)/gim;
  function wireParseChat({ message, isAnonymous, $html }) {
    if (game.user.isGM)
      return;
    if (isAnonymous) {
      if (getSetting("rolls")) {
        const $tooltips = $html.find(".dice-tooltip");
        $tooltips.empty();
        $tooltips.css("padding-top", 0);
        if (getSetting("criticals")) {
          $html.find(".dice-total").removeClass("critical fumble");
        }
        const $save = $html.find(".phase-saving-throws .phase-heading");
        $save.text($save.text().replace(SAVE, ""));
      }
    }
    const $target = $html.find(".phase-attack .token-info .token-name");
    const targetUUID = message.getFlag("wire", "activation.attack.targetActorUuid");
    if ($target.length && targetUUID) {
      try {
        const target = fromUuidSync(targetUUID)?.actor;
        if (target && !target.hasPlayerOwner && !playersSeeName(target)) {
          $target.text(getName(target));
        }
      } catch (error2) {
        console.error(error2);
      }
    }
    const $targets = $html.find(".phase-saving-throws .saving-throw-target:has(.target-name)");
    const targetsUUID = message.getFlag("wire", "activation.targetUuids");
    if ($targets.length && targetsUUID?.length) {
      try {
        for (const uuid of targetsUUID) {
          const target = fromUuidSync(uuid)?.actor;
          if (target && !target.hasPlayerOwner && !playersSeeName(target)) {
            $targets.filter(`[data-actor-id="${uuid}"]`).find(".target-name").text(getName(target));
          }
        }
      } catch (error2) {
        console.error(error2);
      }
    }
  }
  __name(wireParseChat, "wireParseChat");

  // src/third.js
  var thirdPartyInitHooks = createThirdPartyListener();
  var thirdPartyReadyHooks = createThirdPartyListener();
  var thirdPartyChatParse = createThirdPartyListener();
  function thirdPartyInitialization() {
    switch (game.system.id) {
      case "pf2e":
        thirdPartyInitHooks.add(pf2eInitHook);
        thirdPartyReadyHooks.add(pf2eReadyHook);
        thirdPartyChatParse.add(pf2eParseChat);
        break;
      case "dnd5e":
        thirdPartyChatParse.add(dnd5ParseChat);
        break;
    }
    if (game.modules.get("wire")?.active) {
      thirdPartyChatParse.add(wireParseChat);
    }
  }
  __name(thirdPartyInitialization, "thirdPartyInitialization");
  function createThirdPartyListener() {
    const a = [];
    const f = /* @__PURE__ */ __name(function(...args) {
      a.forEach((x) => x(...args));
    }, "f");
    f.add = (fn) => a.push(fn);
    return f;
  }
  __name(createThirdPartyListener, "createThirdPartyListener");

  // src/chat.js
  function renderChatMessage(message, html) {
    if (message.blind)
      return;
    html = html instanceof HTMLElement ? $(html) : html;
    const isGM2 = game.user.isGM;
    const speaker = message.speaker;
    const actor = ChatMessage.getSpeakerActor(speaker);
    const playersCanSee = !actor || playersSeeName(actor);
    const isAnonymous = !!actor && !actor.hasPlayerOwner;
    if (actor && !playersCanSee)
      changeNames(message, actor, html);
    if (!isGM2 && isAnonymous) {
      if (message.rolls.length && getSetting("rolls")) {
        const $result = html.find(".message-content .dice-roll .dice-result");
        $result.find(".dice-formula, .dice-tooltip").remove();
        if (getSetting("criticals"))
          $result.find(".dice-total").removeClass("critical fumble");
      }
      if (getSetting("footer"))
        html.find(".message-content footer.card-footer").remove();
      if (getSetting("cardContent"))
        html.find(".message-content .card-content").remove();
    }
    thirdPartyChatParse({ message, actor, $html: html, playersCanSee, isAnonymous });
  }
  __name(renderChatMessage, "renderChatMessage");
  function changeNames(message, actor, html) {
    const speaker = message.speaker;
    const names = /* @__PURE__ */ new Set();
    if (speaker.alias)
      names.add(speaker.alias);
    if (actor.name)
      names.add(actor.name);
    if (speaker.token && speaker.scene) {
      const scene = game.scenes.get(speaker.scene);
      const token = scene?.tokens.get(speaker.token);
      if (token?.name)
        names.add(token.name);
    }
    if (!names.size)
      return;
    const escaped = Array.from(names).map((x) => RegExp.escape(x));
    const joined = escaped.join("|");
    const regexp = new RegExp(`(^|\\s)(${joined})($|\\s)`, "gmi");
    const renamed = getName(actor);
    const replacement = game.user.isGM ? `$1<span class="anonymous-replaced" title="${renamed}">$2</span>$3` : `$1${renamed}$3`;
    replaceHTMLText(html, regexp, replacement);
  }
  __name(changeNames, "changeNames");

  // src/tracker.js
  function renderCombatTracker(tracker, html) {
    const combatants = ui.combat.viewed?.combatants;
    if (!combatants || !combatants.size)
      return;
    html.querySelectorAll(".combat-tracker .combatant").forEach(function(elem) {
      const id = elem.dataset.combatantId;
      const combatant = combatants.get(id);
      if (!combatant || !combatant.actor || combatant.actor.hasPlayerOwner)
        return;
      const showName = playersSeeName(combatant);
      if (game.user.isGM) {
        const controls = elem.querySelector(".combatant-controls");
        const hidden = controls.querySelector('.combatant-control[data-control="toggleHidden"]');
        const toggle = createToggle2(showName);
        toggle.addEventListener("click", (event) => toggleCombatantName(event, combatant));
        if (hidden)
          hidden.after(toggle);
        else
          controls.appendChild(toggle);
      } else if (!showName) {
        const nameElem = elem.querySelector(".name");
        nameElem.textContent = getName(combatant);
      }
    });
    html.querySelectorAll(".combat-tracker .combatant-group").forEach(function(groupElement) {
      const groupCombatants = Array.from(groupElement.querySelectorAll(".combatant")).map((elem) => {
        const id = elem.dataset.combatantId;
        const combatant = combatants.get(id);
        if (!combatant || !combatant.actor || combatant.actor.hasPlayerOwner)
          return;
        return combatant;
      }).filter((c) => c);
      if (!groupCombatants.length) {
        return;
      }
      const showName = groupCombatants.every((combatant) => playersSeeName(combatant));
      if (game.user.isGM) {
      } else if (!showName) {
        const combatant = groupCombatants[0];
        const nameElem = groupElement.querySelector(".group-header .name");
        nameElem.textContent = `${getName(combatant)} ${localize("group")}`;
      }
    });
  }
  __name(renderCombatTracker, "renderCombatTracker");
  function toggleCombatantName(event, combatant) {
    event.preventDefault();
    event.stopPropagation();
    if (event.shiftKey && combatant.actor && combatant.actor.isToken && game.combat?.scene) {
      getSameCombatants(combatant).forEach(toggleSeeName);
    } else {
      toggleSeeName(combatant);
    }
  }
  __name(toggleCombatantName, "toggleCombatantName");
  function createToggle2(active) {
    const tmp = document.createElement("template");
    const tooltip = active ? "context.hide" : "context.show";
    tmp.innerHTML = `<a
    class="combatant-control${active ? " active" : ""}"
    data-control="toggle-name-visibility"
    data-tooltip="${localize(tooltip)}"
>
    <i class="fa-solid fa-signature"></i>
</a>`;
    return tmp.content.firstChild;
  }
  __name(createToggle2, "createToggle");

  // src/main.js
  Hooks.once("init", () => {
    registerSetting({
      name: "version",
      type: String,
      default: ""
    });
    registerSetting({
      name: "names",
      type: Object,
      default: {},
      onChange: refresh
    });
    registerSetting({
      name: "token",
      type: Boolean,
      default: true,
      config: true
    });
    registerSetting({
      name: "rolls",
      type: Boolean,
      default: true,
      config: true
    });
    registerSetting({
      name: "criticals",
      type: Boolean,
      default: true,
      config: true
    });
    registerSetting({
      name: "cardContent",
      type: Boolean,
      default: false,
      config: true
    });
    registerSetting({
      name: "footer",
      type: Boolean,
      default: false,
      config: true
    });
    registerSettingMenu({
      name: "namesMenu",
      type: AnonymousNamesMenu
    });
    getCurrentModule().api = {
      playersSeeName,
      toggleSeeName,
      getName
    };
    const gm = isGM();
    if (gm) {
      Hooks.on("getActorDirectoryEntryContext", getActorDirectoryEntryContext);
      Hooks.on("renderTokenHUD", renderTokenHUD);
    }
    thirdPartyInitialization();
    thirdPartyInitHooks(gm);
    Hooks.on("renderCombatTracker", renderCombatTracker);
    Hooks.on(isDnD3() ? "dnd5e.renderChatMessage" : "renderChatMessage", renderChatMessage);
    Hooks.on("preCreateToken", preCreateToken);
    Hooks.on("updateActor", onActorUpdate);
  });
  Hooks.once("ready", () => {
    thirdPartyReadyHooks(game.user.isGM);
  });
})();
//# sourceMappingURL=main.js.map
