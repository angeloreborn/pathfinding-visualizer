function run_breadth_first_search(open_blocks, closed_blocks, count){
    if(typeof open_blocks === 'undefined'){
        let start_block = new SiNode(global_start_block.parentNode, undefined);
        open_blocks = [start_block];
    }
    if (!count)count = 0;
    if (!closed_blocks) closed_blocks = new Map();

    let new_list = [];
    while (open_blocks.length > 0) { 
        let current_node = open_blocks.pop();
        let current_neightbors = get_neighbors(current_node, closed_blocks);
        for (const new_neighbor of current_neightbors) {
            let new_node;
            if (typeof new_neighbor != 'undefined'){
                new_node = new SiNode(new_neighbor,current_node)
                new_list.push(new_node);
            }
             new_neighbor.classList.add('selected');
             if (new_neighbor.children.length > 0){
                 if (new_neighbor.children[0].getAttribute('goal') === 'true'){
                     return show_optimal_path(new_node);
                 }
             }    
        }
    }
    setTimeout(()=>{
        run_breadth_first_search(new_list, closed_blocks, count+=1);
    },50)
}