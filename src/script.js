onReady(build_search_space);

function onReady(fn) {
    let checkLoaded = setInterval(() => {
        if (document.readyState === "complete") {
            fn();
            clearInterval(checkLoaded);
        }
    }, 1)
}

var block_space = null;
let placing_walls = false;
let destroying_walls = false;

let x_bounds = 0;
let y_bounds = 0;

function build_search_space() {
    let base_bounds = document.body.getBoundingClientRect();
    let base_width = base_bounds.width / 50
    let base_height = base_bounds.height / 50;
    let map_scale = 2;
    x_bounds = base_width * map_scale;
    y_bounds = base_height * map_scale;
    let block_window = document.querySelector("blocks");
    block_space = block_window;
    document.addEventListener('mouseup', () => {
        placing_walls = false;
        destroying_walls = false;
    })

    for (let y = 0; y < base_height * map_scale; y++) {
        let row = document.createElement("div");
        for (let x = 0; x < base_width * map_scale; x++) {
            let block = document.createElement("block");
            block.className = "block";
            block.setAttribute("x", x);
            block.setAttribute("y", y);
            block.setAttribute("wall", false);
            block.draggable = true;
            block.addEventListener('contextmenu', event => event.preventDefault());
            block.addEventListener("mousedown", (e) => {
                if (e.button === 0) {
                    placing_walls = true;
                    if (start_block_is_selected === false && goal_block_is_selected === false) {
                        if (block.getAttribute("wall") === "false") {
                            block.setAttribute("wall", "true");
                            block.classList.add("wall");
                        }
                    }
                }
                if (e.button === 2) {
                    destroying_walls = true;
                    if (start_block_is_selected === false && goal_block_is_selected === false) {
                        if (block.getAttribute("wall") === "true") {
                            block.setAttribute("wall", "false");
                            block.classList.remove("wall");
                        }
                    }
                }

            })

            block.addEventListener('mouseover', (e) => {
                if (placing_walls === true) {
                    if (start_block_is_selected === false && goal_block_is_selected === false) {
                        if (block.getAttribute("wall") === "false") {
                            block.setAttribute("wall", "true");
                            block.classList.add("wall");
                        }
                    }
                }
                if (destroying_walls === true) {
                    if (start_block_is_selected === false && goal_block_is_selected === false) {
                        if (block.getAttribute("wall") === "true") {
                            block.setAttribute("wall", "false");
                            block.classList.remove("wall");
                        }
                    }
                }
                return;
            })
            row.appendChild(block);
        }
        block_window.appendChild(row);
    }
    let start_block_x = Math.round((base_width / map_scale) / 2);
    let start_block_y = Math.round((base_height / map_scale) / 2);
    get_blocks();
    set_block_state(start_block_x, start_block_y, start_block())
    set_block_state(start_block_x * 2, start_block_y, goal_block())
}

let start_block_is_selected = false;
let goal_block_is_selected = false;
let global_start_block;
let global_goal_block;

function start_block() {
    let start_block = document.createElement("div");
    start_block.className = "start_block";
    global_start_block = start_block;
    start_block.addEventListener("mousedown", () => {
        start_block_is_selected = true;
        placing_walls = false;
        destroying_walls = false;
    });
    document.addEventListener("mouseup", () => {
        start_block_is_selected = false;
    })
    document.addEventListener("mousemove", (e) => {
        if (start_block_is_selected) {
            if (e.target != global_start_block) {
                if (!e.target.classList.contains('wall'))
                    e.target.appendChild(global_start_block);
            }

        }
    })
    return start_block;
}

function goal_block() {
    let goal_block = document.createElement("div");
    goal_block.className = "goal_block";
    global_goal_block = goal_block;
    goal_block.setAttribute('goal', true);
    goal_block.addEventListener("mousedown", () => {
        goal_block_is_selected = true;
    });

    document.addEventListener("mouseup", () => {
        goal_block_is_selected = false;
    })
    document.addEventListener("mousemove", (e) => {
        if (goal_block_is_selected) {
            if (e.target != global_goal_block) {
                if (!e.target.classList.contains('wall')) {
                    if (e.target != global_start_block)
                        e.target.appendChild(global_goal_block);

                }
            }
        }
    })
    return goal_block;
}

function clear_board() {
    for (const block of block_space.children) {
        for (const b of block.children) {
            b.className = 'block';
            b.setAttribute('wall', false);
        }
    }
}
function clear_path() {
    for (const block of block_space.children) {
        for (const b of block.children) {
            if (b.getAttribute('wall') === "true") {
            } else
                b.className = 'block';
        }
    }
}

function get_blocks() {
    return document.querySelector("blocks");
}

function set_block_state(x, y, state) {
    let isolated_block = block_space.children[y].children[x];
    isolated_block.appendChild(state);
}

function reset_block() {
    for (const block of object) {

    }
}


function show_optimal_path(block) {
    setTimeout(() => { }, 1000)
    if (!block) return;
    let show_path = setInterval(() => {
        if (block === undefined) clearInterval(show_path);
        block.self.classList.add('path');
        block = block.ancestor;
    }, 50)
}

function get_neighbors(node, closed_blocks) {
    let neighbors = []
    if (typeof node === 'undefined') return

    let x = parseInt(node.self.getAttribute('x'));
    let y = parseInt(node.self.getAttribute('y'));

    let right_key = `x${x + 1}:y:${y}`;
    if (x + 1 <= x_bounds)
        if (!closed_blocks.has(right_key)) {
            let block = block_space.children[parseInt(y)].children[parseInt(x) + 1]
            if (block.getAttribute('wall') === 'false') {
                neighbors.push(block);
                closed_blocks.set(right_key, 1);
            }

        }
    let down_key = `x${x}:y:${y + 1}`;
    if (y + 1 <= y_bounds)
        if (!closed_blocks.has(down_key)) {
            let block = block_space.children[parseInt(y) + 1].children[parseInt(x)];
            if (block.getAttribute('wall') === 'false') {
                neighbors.push(block);
                closed_blocks.set(down_key, 1);
            }
        }

    let left_key = `x${x - 1}:y:${y}`;
    if (x - 1 >= 0)
        if (!closed_blocks.has(left_key)) {
            let block = block_space.children[parseInt(y)].children[parseInt(x) - 1];
            if (block.getAttribute('wall') === 'false') {
                neighbors.push(block);
                closed_blocks.set(left_key, 1);
            }
        }

    let up_key = `x${x}:y:${y - 1}`;
    if (y - 1 >= 0)
        if (!closed_blocks.has(up_key)) {
            let block = block_space.children[parseInt(y) - 1].children[parseInt(x)];
            if (block.getAttribute('wall') === 'false') {
                neighbors.push(block);
                closed_blocks.set(up_key, 1);
            }
        }
    return neighbors;
}
function start_breadth_first_search() {
    clear_path();
    run_breadth_first_search();
}

var SiNode = /** @class */ (function () {
    class SiNode {
        constructor(self, ancestor) {
            this.self = self;
            this.ancestor = ancestor;
        }
    }
    return SiNode;
}());
