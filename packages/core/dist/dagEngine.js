"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildDag = buildDag;
exports.topoSort = topoSort;
function buildDag(nodes, manualLinks) {
    const edges = [];
    // declared depends_on
    for (const n of nodes) {
        (n.meta.depends_on || []).forEach(dep => edges.push({ from: dep, to: n.name }));
    }
    // manual links
    manualLinks.forEach(([from, to]) => edges.push({ from, to }));
    return edges;
}
function topoSort(nodes, edges) {
    const incoming = new Map();
    const adj = new Map();
    for (const n of nodes) {
        incoming.set(n.name, 0);
        adj.set(n.name, []);
    }
    for (const e of edges) {
        incoming.set(e.to, (incoming.get(e.to) || 0) + 1);
        adj.get(e.from).push(e.to);
    }
    const q = [];
    for (const [name, deg] of incoming)
        if (deg === 0)
            q.push(name);
    const out = [];
    while (q.length) {
        const v = q.shift();
        out.push(v);
        for (const nb of adj.get(v)) {
            incoming.set(nb, (incoming.get(nb) || 0) - 1);
            if (incoming.get(nb) === 0)
                q.push(nb);
        }
    }
    if (out.length !== nodes.length)
        throw new Error('Cycle detected in plugin DAG');
    return out;
}
