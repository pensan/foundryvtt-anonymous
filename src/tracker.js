import { getName, playersSeeName, toggleSeeName } from './api'
import { getSameCombatants, localize } from './module'

export function renderCombatTracker(tracker, html) {
    const combatants = ui.combat.viewed?.combatants
    if (!combatants || !combatants.size) return

    html.querySelectorAll(".combat-tracker .combatant").forEach(function(elem) {    
        const id = elem.dataset.combatantId
        const combatant = combatants.get(id)
        if (!combatant || !combatant.actor || combatant.actor.hasPlayerOwner) return

        const showName = playersSeeName(combatant)

        if (game.user.isGM) {
            const controls = elem.querySelector('.combatant-controls')
            const hidden = controls.querySelector('.combatant-control[data-control="toggleHidden"]')
            const toggle = createToggle(showName)

            toggle.addEventListener('click', event => toggleCombatantName(event, combatant))

            if (hidden) hidden.after(toggle)
            else controls.appendChild(toggle)
        } else if (!showName) {
            const nameElem = elem.querySelector('.name')
            nameElem.textContent = getName(combatant)
        }
    })

    html.querySelectorAll(".combat-tracker .combatant-group").forEach(function(groupElement) {    
        const groupCombatants = Array.from(groupElement.querySelectorAll(".combatant")).map(elem => {
            const id = elem.dataset.combatantId
            const combatant = combatants.get(id)
            if (!combatant || !combatant.actor || combatant.actor.hasPlayerOwner) return;
            return combatant;
        }).filter(c => c)

        if(!groupCombatants.length) {
            return;
        }

        const showName = groupCombatants.every(combatant => playersSeeName(combatant))

        if (game.user.isGM) {
            // TODO: Add a control to toggle show names for all groups
        } else if (!showName) {
            const combatant = groupCombatants[0]
            const nameElem = groupElement.querySelector('.group-header .name')
            nameElem.textContent = `${getName(combatant)} ${localize('group')}`
        }
    })
}

function toggleCombatantName(event, combatant) {
    event.preventDefault()
    event.stopPropagation()

    if (event.shiftKey && combatant.actor && combatant.actor.isToken && game.combat?.scene) {
        getSameCombatants(combatant).forEach(toggleSeeName)
    } else {
        toggleSeeName(combatant)
    }
}

function createToggle(active) {
    const tmp = document.createElement('template')
    const tooltip = active ? 'context.hide' : 'context.show'

    tmp.innerHTML = `<a
    class="combatant-control${active ? ' active' : ''}"
    data-control="toggle-name-visibility"
    data-tooltip="${localize(tooltip)}"
>
    <i class="fa-solid fa-signature"></i>
</a>`

    return tmp.content.firstChild
}
