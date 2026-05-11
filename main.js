(function () {
  const { useEffect, useMemo, useRef, useState } = React;
  const h = React.createElement;
  const STORAGE_KEY = "dnd-initiative-tracker:v1";
  const CHANNEL_NAME = "dnd-initiative-tracker-sync";
  const EXPORT_FILENAME = "roundkeeper-campaign-backup.json";
  const CELEBRATION_DURATION = 6000;
  const PROJECT_IMAGE_ROOTS = [
    "/Users/jimsedgwick/Documents/Codex/2026-04-28/build-a-local-react-web-app",
    "/Users/jimsedgwick/Library/Application Support/DND Initiative/app",
  ];
  const SHERLOCK_CONDITION_IMAGE_BASE = "/images/Sherlock%20Gnomes%20Conditions";
  const CONDITIONS = [
    "Blinded",
    "Charmed",
    "Death Saves",
    "Deafened",
    "Frightened",
    "Grappled",
    "Incapacitated",
    "Invisible",
    "Paralyzed",
    "Petrified",
    "Poisoned",
    "Prone",
    "Restrained",
    "Stunned",
    "Unconscious",
    "Exhaustion",
  ];
  const CONDITION_LABELS = {
    Blinded: "Blind",
    Charmed: "Charm",
    "Death Saves": "Death",
    Deafened: "Deaf",
    Frightened: "Fear",
    Grappled: "Grab",
    Incapacitated: "Incap",
    Invisible: "Invis",
    Paralyzed: "Para",
    Petrified: "Stone",
    Poisoned: "Poison",
    Prone: "Prone",
    Restrained: "Restr",
    Stunned: "Stun",
    Unconscious: "Uncon",
    Exhaustion: "Exh",
  };
  function isCelebrating(state, character) {
    return (
      state.celebration &&
      state.celebration.characterId === character.id &&
      Date.now() - state.celebration.startedAt < CELEBRATION_DURATION
    );
  }

  function characterImageKey(character) {
    return character.name.trim().toLowerCase().replace(/\s+/g, " ");
  }

  function isSherlockGnomes(character) {
    return characterImageKey(character) === "sherlock gnomes";
  }

  function webImageUrl(imageUrl = "") {
    const trimmedUrl = imageUrl.trim();
    const matchingRoot = PROJECT_IMAGE_ROOTS.find((root) => trimmedUrl.startsWith(`${root}/`));
    if (!matchingRoot) return trimmedUrl;
    return trimmedUrl.slice(matchingRoot.length);
  }

  function privateCampaignImageUrl(character, variant, privateImages = {}) {
    return privateImages[characterImageKey(character)]?.[variant] || "";
  }

  function conditionImageUrl(character, privateImages = {}) {
    const conditions = character.conditions || [];
    if (conditions.includes("Unconscious")) {
      const privateImage = privateCampaignImageUrl(character, "Unconscious", privateImages);
      if (privateImage) return privateImage;
    }
    if (!isSherlockGnomes(character)) return "";
    const matchingCondition = CONDITIONS.find((condition) => conditions.includes(condition));
    if (!matchingCondition) return "";
    return `${SHERLOCK_CONDITION_IMAGE_BASE}/Sherlock%20${encodeURIComponent(matchingCondition)}.jpg`;
  }

  function victoryImageUrl(character, privateImages = {}) {
    const privateImage = privateCampaignImageUrl(character, "Victory", privateImages);
    if (privateImage) return privateImage;
    if (!isSherlockGnomes(character)) return "";
    return `${SHERLOCK_CONDITION_IMAGE_BASE}/Sherlock%20Victory.jpg`;
  }

  function characterImageUrl(character, celebrating = false, privateImages = {}) {
    return webImageUrl((celebrating && victoryImageUrl(character, privateImages)) || conditionImageUrl(character, privateImages) || character.imageUrl);
  }

  function portrait(name, palette) {
    const initials = name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join("");
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 620">
        <defs>
          <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stop-color="${palette[0]}"/>
            <stop offset="52%" stop-color="${palette[1]}"/>
            <stop offset="100%" stop-color="${palette[2]}"/>
          </linearGradient>
          <radialGradient id="r" cx="50%" cy="30%" r="65%">
            <stop offset="0%" stop-color="rgba(255,242,190,.64)"/>
            <stop offset="65%" stop-color="rgba(255,242,190,.08)"/>
            <stop offset="100%" stop-color="rgba(0,0,0,.7)"/>
          </radialGradient>
        </defs>
        <rect width="480" height="620" fill="url(#g)"/>
        <rect width="480" height="620" fill="url(#r)"/>
        <path d="M48 556 C92 474 134 420 230 408 C332 396 398 452 436 556 Z" fill="rgba(17,10,22,.62)"/>
        <circle cx="240" cy="238" r="112" fill="rgba(248,230,176,.78)"/>
        <path d="M122 262 C146 116 344 112 370 262 C326 214 293 190 240 190 C187 190 151 214 122 262 Z" fill="rgba(22,14,28,.78)"/>
        <path d="M88 78 L392 78 L430 562 L50 562 Z" fill="none" stroke="rgba(247,214,126,.58)" stroke-width="12"/>
        <path d="M112 104 L368 104 L400 536 L80 536 Z" fill="none" stroke="rgba(255,255,255,.16)" stroke-width="3"/>
        <text x="240" y="355" text-anchor="middle" font-family="Georgia, serif" font-size="104" font-weight="700" fill="rgba(255,248,218,.92)">${initials}</text>
      </svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  const samples = [
    {
      id: "char-nymera",
      name: "Nymera Dawnsworn",
      type: "Hero",
      initiative: 21,
      visible: true,
      imageUrl: portrait("Nymera Dawnsworn", ["#77432d", "#2d1228", "#0e1119"]),
    },
    {
      id: "char-borun",
      name: "Borun Ironvale",
      type: "Hero",
      initiative: 17,
      visible: true,
      imageUrl: portrait("Borun Ironvale", ["#62523a", "#243142", "#101318"]),
    },
    {
      id: "char-seraphine",
      name: "Seraphine Quill",
      type: "NPC",
      initiative: 14,
      visible: true,
      imageUrl: portrait("Seraphine Quill", ["#614076", "#1f3555", "#0d1018"]),
    },
    {
      id: "char-ashmaw",
      name: "Ashmaw Hobgoblin",
      type: "Monster",
      initiative: 12,
      visible: true,
      imageUrl: portrait("Ashmaw Hobgoblin", ["#763c33", "#3c191c", "#111016"]),
    },
    {
      id: "char-mirefang",
      name: "Mirefang Drake",
      type: "Monster",
      initiative: 8,
      visible: true,
      imageUrl: portrait("Mirefang Drake", ["#2f594d", "#233721", "#101318"]),
    },
  ];

  const defaultState = {
    characters: samples,
    activeId: "char-nymera",
    celebration: null,
    displayMode: "auto",
    orderMode: "initiative",
    version: 1,
  };

  function normalizeState(state) {
    return {
      ...defaultState,
      ...state,
      characters: (state.characters || []).map((character) => ({
        armorClass: "",
        conditions: [],
        playerOrder: "",
        visible: true,
        type: "Hero",
        ...character,
      })),
    };
  }

  function loadState() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (stored && Array.isArray(stored.characters)) {
        return normalizeState(stored);
      }
    } catch (error) {
      console.warn("Unable to load initiative tracker state", error);
    }
    return defaultState;
  }

  function downloadJson(filename, payload) {
    const blob = new Blob([`${JSON.stringify(payload, null, 2)}\n`], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function readFileAsText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(reader.error || new Error("Unable to read file"));
      reader.readAsText(file);
    });
  }

  function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(reader.error || new Error("Unable to read image"));
      reader.readAsDataURL(file);
    });
  }

  function sortCharacters(characters) {
    return [...characters].sort((a, b) => {
      const aHasInitiative = a.initiative !== "" && a.initiative != null;
      const bHasInitiative = b.initiative !== "" && b.initiative != null;
      if (aHasInitiative !== bHasInitiative) return bHasInitiative ? 1 : -1;
      const initiativeDifference = Number(b.initiative || 0) - Number(a.initiative || 0);
      if (initiativeDifference !== 0) return initiativeDifference;
      return a.name.localeCompare(b.name);
    });
  }

  function playerOrderValue(character) {
    return character.playerOrder === "" || character.playerOrder == null
      ? Number.POSITIVE_INFINITY
      : Number(character.playerOrder);
  }

  function sortByPlayerOrder(characters) {
    return [...characters].sort((a, b) => {
      const orderDifference = playerOrderValue(a) - playerOrderValue(b);
      if (orderDifference !== 0) return orderDifference;
      return a.name.localeCompare(b.name);
    });
  }

  function orderCharacters(characters, orderMode) {
    return orderMode === "player" ? sortByPlayerOrder(characters) : sortCharacters(characters);
  }

  function nextVisibleId(characters, activeId, direction, orderMode = "initiative") {
    const visible = orderCharacters(characters, orderMode).filter((character) => character.visible);
    if (visible.length === 0) return "";
    const activeIndex = visible.findIndex((character) => character.id === activeId);
    if (activeIndex === -1) return visible[0].id;
    const nextIndex = (activeIndex + direction + visible.length) % visible.length;
    return visible[nextIndex].id;
  }

  function isTypingTarget(target) {
    if (!target) return false;
    const tagName = target.tagName;
    return (
      target.isContentEditable ||
      tagName === "INPUT" ||
      tagName === "TEXTAREA" ||
      tagName === "SELECT"
    );
  }

  function useCombatState() {
    const [state, setState] = useState(loadState);
    const broadcastRef = useRef(null);
    const skipBroadcastRef = useRef(false);

    useEffect(() => {
      if (!("BroadcastChannel" in window)) return undefined;
      const channel = new BroadcastChannel(CHANNEL_NAME);
      broadcastRef.current = channel;
      channel.onmessage = (event) => {
        if (!event.data || event.data.type !== "combat-state" || !event.data.state) return;
        skipBroadcastRef.current = true;
        setState(normalizeState(event.data.state));
      };
      return () => {
        channel.close();
        broadcastRef.current = null;
      };
    }, []);

    useEffect(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      if (skipBroadcastRef.current) {
        skipBroadcastRef.current = false;
        return;
      }
      broadcastRef.current?.postMessage({ type: "combat-state", state });
    }, [state]);

    useEffect(() => {
      function syncFromStorage(event) {
        if (event.key !== STORAGE_KEY || !event.newValue) return;
        try {
          skipBroadcastRef.current = true;
          setState(normalizeState(JSON.parse(event.newValue)));
        } catch (error) {
          console.warn("Unable to sync initiative tracker state", error);
        }
      }

      window.addEventListener("storage", syncFromStorage);
      return () => window.removeEventListener("storage", syncFromStorage);
    }, []);

    const updateCharacter = (id, patch) => {
      setState((current) => ({
        ...current,
        characters: current.characters.map((character) =>
          character.id === id ? { ...character, ...patch } : character,
        ),
      }));
    };

    return { state, setState, updateCharacter };
  }

  function usePrivateConditionImages() {
    const [privateImages, setPrivateImages] = useState({});

    useEffect(() => {
      let isMounted = true;
      fetch("/api/private-condition-images")
        .then((response) => (response.ok ? response.json() : {}))
        .then((images) => {
          if (isMounted && images && typeof images === "object") {
            setPrivateImages(images);
          }
        })
        .catch((error) => {
          console.warn("Unable to load private condition images", error);
        });

      return () => {
        isMounted = false;
      };
    }, []);

    return privateImages;
  }

  function useInitiativeHotkeys(setState) {
    useEffect(() => {
      function handleKeyDown(event) {
        if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
          return;
        }

        if (isTypingTarget(event.target)) return;

        const direction = event.key === "ArrowDown" ? 1 : event.key === "ArrowUp" ? -1 : 0;
        if (!direction) return;

        event.preventDefault();
        setState((current) => ({
          ...current,
          activeId: nextVisibleId(current.characters, current.activeId, direction, current.orderMode),
        }));
      }

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [setState]);
  }

  function useCelebrationCleanup(state, setState) {
    useEffect(() => {
      if (!state.celebration) return undefined;
      const remaining = CELEBRATION_DURATION - (Date.now() - state.celebration.startedAt);
      if (remaining <= 0) {
        setState((current) => ({ ...current, celebration: null }));
        return undefined;
      }
      const timeoutId = window.setTimeout(() => {
        setState((current) =>
          current.celebration?.startedAt === state.celebration.startedAt
            ? { ...current, celebration: null }
            : current,
        );
      }, remaining);
      return () => window.clearTimeout(timeoutId);
    }, [state.celebration, setState]);
  }

  function Field({ label, children }) {
    return h("label", { className: "field" }, h("span", null, label), children);
  }

  function Button({ children, className = "", ...props }) {
    return h("button", { className: `button ${className}`.trim(), ...props }, children);
  }

  function preventNumberWheel(event) {
    event.currentTarget.blur();
  }

  function conditionButtonText(conditions = []) {
    if (!conditions.length) return "None";
    const [firstCondition, ...otherConditions] = conditions;
    return otherConditions.length ? `${firstCondition} +${otherConditions.length}` : firstCondition;
  }

  function ConditionTags({ conditions = [], compact = false }) {
    if (!conditions.length) return null;
    const limit = compact ? 2 : 3;
    const visibleConditions = conditions.slice(0, limit);
    const remaining = conditions.length - visibleConditions.length;

    return h(
      "div",
      { className: "condition-tags", "aria-label": `Conditions: ${conditions.join(", ")}` },
      visibleConditions.map((condition) =>
        h("span", { key: condition, title: condition }, condition),
      ),
      remaining > 0 && h("span", { title: conditions.slice(limit).join(", ") }, `+${remaining}`),
    );
  }

  function DmRoute() {
    const { state, setState, updateCharacter } = useCombatState();
    const privateImages = usePrivateConditionImages();
    useInitiativeHotkeys(setState);
    useCelebrationCleanup(state, setState);
    const [conditionTargetId, setConditionTargetId] = useState("");
    const [saveStatus, setSaveStatus] = useState("");
    const backupInputRef = useRef(null);
    const [draft, setDraft] = useState({
      name: "",
      imageUrl: "",
      type: "Hero",
      initiative: "",
      armorClass: "",
      playerOrder: "",
    });

    const ordered = useMemo(
      () => orderCharacters(state.characters, state.orderMode),
      [state.characters, state.orderMode],
    );
    const visibleOrdered = ordered.filter((character) => character.visible);
    const active = state.characters.find((character) => character.id === state.activeId);
    const displayMode = state.displayMode || "auto";
    const conditionTarget = state.characters.find((character) => character.id === conditionTargetId);

    useEffect(() => {
      if (!state.activeId) return;
      const activeRow = document.querySelector(`[data-character-id="${state.activeId}"]`);
      activeRow?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }, [state.activeId]);

    function setDraftValue(key, value) {
      setDraft((current) => ({ ...current, [key]: value }));
    }

    async function setDraftImageFile(file) {
      if (!file) return;
      try {
        const imageUrl = await readFileAsDataUrl(file);
        setDraftValue("imageUrl", imageUrl);
        setSaveStatus("Image loaded into browser storage");
      } catch (error) {
        console.warn("Unable to load image", error);
        setSaveStatus("Image load failed");
      }
    }

    async function setCharacterImageFile(characterId, file) {
      if (!file) return;
      try {
        const imageUrl = await readFileAsDataUrl(file);
        updateCharacter(characterId, { imageUrl });
        setSaveStatus("Image loaded into browser storage");
      } catch (error) {
        console.warn("Unable to load image", error);
        setSaveStatus("Image load failed");
      }
    }

    function addCharacter(event) {
      event.preventDefault();
      const name = draft.name.trim();
      if (!name) return;
      const id = `char-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
      const character = {
        id,
        name,
        type: draft.type,
        initiative: draft.initiative === "" ? "" : Number(draft.initiative),
        armorClass: draft.armorClass ? Number(draft.armorClass) : "",
        playerOrder: draft.playerOrder === "" ? "" : Number(draft.playerOrder),
        conditions: [],
        visible: true,
        imageUrl: draft.imageUrl.trim() || portrait(name, ["#6e5534", "#263c4c", "#121018"]),
      };
      setState((current) => ({
        ...current,
        activeId: current.activeId || id,
        characters: orderCharacters([...current.characters, character], current.orderMode),
      }));
      setDraft({ name: "", imageUrl: "", type: "Hero", initiative: "", armorClass: "", playerOrder: "" });
    }

    function removeCharacter(id) {
      setState((current) => {
        const characters = current.characters.filter((character) => character.id !== id);
        const activeId = current.activeId === id ? nextVisibleId(characters, "", 0, current.orderMode) : current.activeId;
        return { ...current, characters, activeId };
      });
    }

    function toggleVisibility(id) {
      setState((current) => {
        const target = current.characters.find((character) => character.id === id);
        if (!target) return current;
        const characters = current.characters.map((character) =>
          character.id === id ? { ...character, visible: !character.visible } : character,
        );
        if (current.activeId === id && target.visible) {
          return { ...current, characters, activeId: nextVisibleId(characters, id, 1, current.orderMode) };
        }
        if (!current.activeId && !target.visible) {
          return { ...current, characters, activeId: id };
        }
        return { ...current, characters };
      });
    }

    function toggleCondition(characterId, condition) {
      setState((current) => ({
        ...current,
        characters: current.characters.map((character) => {
          if (character.id !== characterId) return character;
          const conditions = character.conditions || [];
          const nextConditions = conditions.includes(condition)
            ? conditions.filter((item) => item !== condition)
            : [...conditions, condition];
          return { ...character, conditions: nextConditions };
        }),
      }));
    }

    function clearConditions(characterId) {
      updateCharacter(characterId, { conditions: [] });
    }

    function resetCombat() {
      if (!window.confirm("Clear initiatives and sort by player order?")) return;
      setConditionTargetId("");
      setState((current) => ({
        ...current,
        orderMode: "player",
        activeId: sortByPlayerOrder(current.characters).find((character) => character.visible)?.id || current.activeId,
        characters: sortByPlayerOrder(current.characters).map((character) => ({
          ...character,
          initiative: "",
        })),
      }));
    }

    function sortInitiativeOrder() {
      setState((current) => {
        const characters = sortCharacters(current.characters);
        return {
          ...current,
          orderMode: "initiative",
          activeId: characters.find((character) => character.visible)?.id || current.activeId,
          characters,
        };
      });
    }

    function handleInitiativeKeyDown(event) {
      if (event.key !== "Tab") return;
      const inputs = [...document.querySelectorAll(".initiative-input")];
      const currentIndex = inputs.indexOf(event.currentTarget);
      if (currentIndex === -1) return;
      const nextIndex = currentIndex + (event.shiftKey ? -1 : 1);
      if (nextIndex < 0 || nextIndex >= inputs.length) return;
      event.preventDefault();
      inputs[nextIndex].focus();
      inputs[nextIndex].select();
    }

    function celebrateCharacter(character) {
      setState((current) => ({
        ...current,
        celebration: {
          characterId: character.id,
          startedAt: Date.now(),
        },
      }));
    }

    function exportCombatState() {
      try {
        downloadJson(EXPORT_FILENAME, {
          app: "Roundkeeper",
          exportedAt: new Date().toISOString(),
          state: normalizeState(state),
        });
        setSaveStatus("Backup file exported");
      } catch (error) {
        console.warn("Unable to export combat state", error);
        setSaveStatus("Export failed");
      }
    }

    async function importCombatState(event) {
      const file = event.target.files?.[0];
      event.target.value = "";
      if (!file) return;
      if (!window.confirm("Import this backup file? This will replace the current screen state.")) return;
      setSaveStatus("Loading...");
      try {
        const parsed = JSON.parse(await readFileAsText(file));
        const importedState = parsed.state && Array.isArray(parsed.state.characters) ? parsed.state : parsed;
        if (!importedState || !Array.isArray(importedState.characters)) {
          throw new Error("Backup file does not include a characters array");
        }
        const savedState = normalizeState(importedState);
        setConditionTargetId("");
        setState(savedState);
        setSaveStatus("Backup imported");
      } catch (error) {
        console.warn("Unable to import combat state", error);
        setSaveStatus("Import failed");
      }
    }

    return h(
      "main",
      { className: "dm-shell" },
      h(
        "header",
        { className: "dm-header" },
        h(
          "div",
          { className: "brand-lockup" },
          h("img", { src: "/images/roundkeeper-mark.svg", alt: "", className: "brand-mark" }),
          h(
            "div",
            null,
          h("p", { className: "eyebrow" }, "Dungeon Master"),
            h("h1", null, "Roundkeeper"),
          ),
        ),
        h(
          "nav",
          { className: "route-links", "aria-label": "Routes" },
          h("a", { href: "/dm", "aria-current": "page" }, "DM"),
          h("a", { href: "/display", target: "_blank", rel: "noreferrer" }, "Display"),
        ),
      ),
      h(
        "section",
        { className: "dm-grid" },
        h(
          "form",
          { className: "panel add-panel", onSubmit: addCharacter },
          h("h2", null, "Add Character"),
          h(Field, { label: "Name" }, h("input", {
            value: draft.name,
            onChange: (event) => setDraftValue("name", event.target.value),
            placeholder: "Veyra Nightbloom",
          })),
          h(Field, { label: "Image URL" }, h("input", {
            value: draft.imageUrl,
            onChange: (event) => setDraftValue("imageUrl", event.target.value),
            placeholder: "Leave blank for a placeholder",
          })),
          h(Field, { label: "Image File" }, h("input", {
            type: "file",
            accept: "image/*",
            onChange: (event) => setDraftImageFile(event.target.files?.[0]),
          })),
          h(
            "div",
            { className: "form-row" },
            h(Field, { label: "Type" }, h(
              "select",
              { value: draft.type, onChange: (event) => setDraftValue("type", event.target.value) },
              ["Hero", "NPC", "Monster", "Ally", "Lair"].map((type) => h("option", { key: type }, type)),
            )),
            h(Field, { label: "Initiative" }, h("input", {
              type: "number",
              inputMode: "numeric",
              value: draft.initiative,
              onChange: (event) => setDraftValue("initiative", event.target.value),
              onWheel: preventNumberWheel,
              placeholder: "0",
            })),
          ),
          h(Field, { label: "Armor Class" }, h("input", {
            type: "number",
            inputMode: "numeric",
            value: draft.armorClass,
            onChange: (event) => setDraftValue("armorClass", event.target.value),
            onWheel: preventNumberWheel,
            placeholder: "Optional",
          })),
          h(Field, { label: "Player Order" }, h("input", {
            type: "number",
            inputMode: "numeric",
            min: "1",
            value: draft.playerOrder,
            onChange: (event) => setDraftValue("playerOrder", event.target.value),
            onWheel: preventNumberWheel,
            placeholder: "Seat number",
          })),
          h(Button, { className: "primary", type: "submit" }, "+ Add"),
        ),
        h(
          "section",
          { className: "panel controls-panel" },
          h("h2", null, "Combat"),
          h(
            "div",
            { className: "active-summary" },
            h("span", null, "Active"),
            h("strong", null, active ? active.name : "None"),
            h("small", null, active && active.armorClass !== "" && active.armorClass != null ? `AC ${active.armorClass}` : "AC --"),
          ),
          h(
            "div",
            { className: "control-grid" },
            h(Button, {
              onClick: () => setState((current) => ({ ...current, activeId: nextVisibleId(current.characters, current.activeId, -1, current.orderMode) })),
            }, "Prev"),
            h(Button, {
              className: "primary",
              onClick: () => setState((current) => ({ ...current, activeId: nextVisibleId(current.characters, current.activeId, 1, current.orderMode) })),
            }, "Next"),
            h(Button, { onClick: sortInitiativeOrder }, "Sort"),
            h(Button, { className: "danger", onClick: resetCombat }, "Clear"),
          ),
          h(
            "div",
            { className: "save-control" },
            h(Button, { className: "gold", onClick: exportCombatState, type: "button" }, "Export Backup"),
            h(Button, { onClick: () => backupInputRef.current?.click(), type: "button" }, "Import Backup"),
            h("input", {
              ref: backupInputRef,
              type: "file",
              accept: "application/json,.json",
              className: "visually-hidden",
              onChange: importCombatState,
            }),
            saveStatus && h("span", null, saveStatus),
          ),
          h(
            "div",
            { className: "mode-control", role: "group", "aria-label": "Display mode" },
            h("span", null, "Display"),
            ["auto", "standard", "large"].map((mode) =>
              h(Button, {
                key: mode,
                className: displayMode === mode ? "mode-button is-selected" : "mode-button",
                onClick: () => setState((current) => ({ ...current, displayMode: mode })),
                type: "button",
              }, mode[0].toUpperCase() + mode.slice(1)),
            ),
          ),
          h(
            "div",
            { className: "combat-stats" },
            h("span", null, `${visibleOrdered.length} visible`),
            h("span", null, `${state.characters.length} total`),
            h("span", null, state.orderMode === "player" ? "player order" : "initiative order"),
          ),
        ),
      ),
      h(
        "section",
        { className: "roster" },
        ordered.map((character) => {
          const characterConditions = character.conditions || [];

          return h(
            "article",
            {
              key: character.id,
              "data-character-id": character.id,
              className: `roster-row ${character.id === state.activeId ? "is-active" : ""} ${!character.visible ? "is-hidden" : ""}`,
            },
            h("img", { src: characterImageUrl(character, isCelebrating(state, character), privateImages), alt: "", className: "roster-avatar" }),
            h(
              "div",
              { className: "roster-main" },
              h(
                "div",
                { className: "roster-title" },
                h("input", {
                  className: "name-input",
                  value: character.name,
                  onChange: (event) => updateCharacter(character.id, { name: event.target.value }),
                  "aria-label": "Character name",
                }),
                h("span", { className: `type-pill type-${character.type.toLowerCase()}` }, character.type),
              ),
              h("input", {
                className: "url-input",
                value: character.imageUrl,
                onChange: (event) => updateCharacter(character.id, { imageUrl: event.target.value }),
                "aria-label": "Image URL",
              }),
              h("input", {
                className: "file-input",
                type: "file",
                accept: "image/*",
                onChange: (event) => setCharacterImageFile(character.id, event.target.files?.[0]),
                "aria-label": `Upload image for ${character.name}`,
              }),
            ),
            h("input", {
              className: "initiative-input",
              type: "number",
              inputMode: "numeric",
              value: character.initiative,
              onChange: (event) =>
                updateCharacter(character.id, {
                  initiative: event.target.value === "" ? "" : Number(event.target.value),
                }),
              onKeyDown: handleInitiativeKeyDown,
              onWheel: preventNumberWheel,
              "aria-label": `${character.name} initiative`,
            }),
            h(
              "label",
              { className: "player-order-field" },
              h("span", null, "Order"),
              h("input", {
                className: "player-order-input",
                type: "number",
                inputMode: "numeric",
                min: "1",
                value: character.playerOrder ?? "",
                onChange: (event) =>
                  updateCharacter(character.id, {
                    playerOrder: event.target.value === "" ? "" : Number(event.target.value),
                  }),
                onWheel: preventNumberWheel,
                "aria-label": `${character.name} player order`,
              }),
            ),
            h(
              "label",
              { className: "armor-class-field" },
              h("span", null, "AC"),
              h("input", {
                className: "armor-class-input",
                type: "number",
                inputMode: "numeric",
                value: character.armorClass ?? "",
                onChange: (event) =>
                  updateCharacter(character.id, {
                    armorClass: event.target.value === "" ? "" : Number(event.target.value),
                  }),
                onWheel: preventNumberWheel,
                "aria-label": `${character.name} armor class`,
              }),
            ),
            h(
              "div",
              { className: "row-actions" },
              h(Button, {
                className: characterConditions.length ? "conditions-button has-conditions" : "conditions-button",
                onClick: () => setConditionTargetId(character.id),
                title: characterConditions.length ? characterConditions.join(", ") : "No conditions",
                type: "button",
              },
                h("span", { className: "cond-button-label" }, "Cond"),
                h("span", { className: "cond-button-value" }, conditionButtonText(characterConditions)),
              ),
              h(Button, {
                className: character.visible ? "toggle active-toggle" : "toggle",
                onClick: () => toggleVisibility(character.id),
              }, character.visible ? "Shown" : "Hidden"),
              h(Button, {
                className: character.id === state.activeId ? "gold" : "",
                onClick: () => setState((current) => ({ ...current, activeId: character.id })),
              }, "Active"),
              h(Button, {
                className: "victory-button",
                onClick: () => celebrateCharacter(character),
                type: "button",
              }, "Victory"),
              h(Button, { className: "icon danger", onClick: () => removeCharacter(character.id), "aria-label": `Remove ${character.name}` }, "x"),
            ),
          );
        }),
      ),
      h(
        "div",
        { className: "bottom-actions" },
        h(Button, { className: "primary", onClick: sortInitiativeOrder, type: "button" }, "Sort"),
      ),
      conditionTarget && h(
        "div",
        { className: "modal-backdrop", role: "presentation", onClick: () => setConditionTargetId("") },
        h(
          "section",
          {
            className: "condition-modal",
            role: "dialog",
            "aria-modal": "true",
            "aria-labelledby": "condition-modal-title",
            onClick: (event) => event.stopPropagation(),
          },
          h(
            "div",
            { className: "modal-header" },
            h(
              "div",
              null,
              h("p", { className: "eyebrow" }, "Conditions"),
              h("h2", { id: "condition-modal-title" }, conditionTarget.name),
            ),
            h(Button, {
              className: "icon",
              onClick: () => setConditionTargetId(""),
              type: "button",
              "aria-label": "Close conditions",
            }, "x"),
          ),
          h(
            "div",
            { className: "condition-grid" },
            CONDITIONS.map((condition) =>
              h(
                "label",
                { key: condition, className: "condition-option" },
                h("input", {
                  type: "checkbox",
                  checked: (conditionTarget.conditions || []).includes(condition),
                  onChange: () => toggleCondition(conditionTarget.id, condition),
                }),
                h("span", null, condition),
              ),
            ),
          ),
          h(
            "div",
            { className: "modal-actions" },
            h(Button, {
              className: "danger",
              onClick: () => clearConditions(conditionTarget.id),
              type: "button",
            }, "Clear"),
            h(Button, {
              className: "primary",
              onClick: () => setConditionTargetId(""),
              type: "button",
            }, "Done"),
          ),
        ),
      ),
    );
  }

  function DisplayCard({ character, active, upNext, celebrating, privateImages }) {
    return h(
      "article",
      {
        className: [
          "display-card",
          `display-type-${character.type.toLowerCase()}`,
          active ? "is-active" : "",
          upNext ? "is-next" : "",
          celebrating ? "is-celebrating" : "",
        ].filter(Boolean).join(" "),
      },
      celebrating && h(
        "div",
        { className: "celebration-effects", "aria-hidden": "true" },
        [1, 2, 3, 4, 5, 6].map((spark) => h("span", { key: spark })),
      ),
      active && h("div", { className: "turn-arrow" }, h("span", null, "Current")),
      upNext && h("div", { className: "next-label is-next" }, "Next"),
      h("div", { className: "initiative-badge" }, character.initiative),
      h(ConditionTags, { conditions: character.conditions || [] }),
      h(
        "div",
        { className: "portrait-frame" },
        h("img", { src: characterImageUrl(character, celebrating, privateImages), alt: character.name }),
      ),
      h(
        "div",
        { className: "display-name" },
        h("strong", null, character.name),
        h("span", null, character.type),
      ),
      active && h("div", { className: "current-label" }, "Current Turn"),
    );
  }

  function DisplayRoute() {
    const { state } = useCombatState();
    const privateImages = usePrivateConditionImages();
    const visible = useMemo(
      () => orderCharacters(state.characters, state.orderMode).filter((character) => character.visible),
      [state.characters, state.orderMode],
    );
    const showTurnIndicators = state.orderMode !== "player";
    const activeIndex = visible.findIndex((character) => character.id === state.activeId);
    const nextIndex = activeIndex === -1 || visible.length < 2 ? -1 : (activeIndex + 1) % visible.length;
    const mode = state.displayMode || "auto";
    const largeEncounter = mode === "large" || (mode === "auto" && visible.length >= 9);
    const compactEncounter = visible.length >= 13;
    const packedEncounter = visible.length >= 21;
    const displayColumns =
      visible.length <= 4
        ? Math.max(1, visible.length)
        : visible.length <= 8
          ? Math.ceil(visible.length / 2)
          : visible.length <= 12
            ? Math.ceil(visible.length / 2)
            : visible.length <= 20
              ? Math.ceil(visible.length / 3)
              : Math.ceil(visible.length / 4);
    const displayRows = Math.max(1, Math.ceil(Math.max(visible.length, 1) / displayColumns));

    return h(
      "main",
      {
        className: [
          "display-shell",
          largeEncounter ? "mode-large" : "mode-standard",
          compactEncounter ? "mode-compact" : "",
          packedEncounter ? "mode-packed" : "",
        ].filter(Boolean).join(" "),
      },
      h(
        "div",
        { className: "display-board" },
        h(
          "header",
          { className: "display-header" },
          h("span", { className: "ornament-line" }),
          h("h1", null, "Roundkeeper"),
          h("span", { className: "ornament-line" }),
        ),
        h(
          "section",
          { className: "display-stage", "aria-label": "Initiative order" },
          h("div", { className: "stage-rail stage-rail-top", "aria-hidden": "true" }),
          h(
            "div",
            {
              className: "display-track",
              style: {
                "--display-columns": displayColumns,
                "--display-rows": displayRows,
                "--visible-count": Math.max(visible.length, 1),
              },
            },
            visible.length
              ? visible.map((character, index) =>
                  h(DisplayCard, {
                    key: character.id,
                    character,
                    active: showTurnIndicators && character.id === state.activeId,
                    upNext: showTurnIndicators && index === nextIndex,
                    celebrating: isCelebrating(state, character),
                    privateImages,
                  }),
                )
              : h("div", { className: "empty-display" }, "No visible characters"),
          ),
          h("div", { className: "stage-rail stage-rail-bottom", "aria-hidden": "true" }),
        ),
      ),
    );
  }

  function App() {
    const route = window.location.pathname === "/display" ? "display" : "dm";
    return route === "display" ? h(DisplayRoute) : h(DmRoute);
  }

  ReactDOM.createRoot(document.getElementById("root")).render(h(App));
})();
