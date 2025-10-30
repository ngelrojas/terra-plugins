"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.synthPolicies = synthPolicies;
function synthPolicies(metas) {
    // Minimal alpha: group by actor and merge actions/resources
    const byActor = new Map();
    for (const meta of metas) {
        for (const cap of meta.capabilities || []) {
            const actor = cap.actor || 'default-role';
            if (!byActor.has(actor))
                byActor.set(actor, new Map());
            const actions = byActor.get(actor);
            for (const need of cap.needs) {
                if (!actions.has(need.action))
                    actions.set(need.action, new Set());
                actions.get(need.action).add(need.resource);
            }
        }
    }
    const res = [];
    for (const [actor, actions] of byActor) {
        const statements = [];
        for (const [action, resources] of actions) {
            for (const resource of resources)
                statements.push({ action, resource });
        }
        res.push({ principal: actor, statements });
    }
    return res;
}
