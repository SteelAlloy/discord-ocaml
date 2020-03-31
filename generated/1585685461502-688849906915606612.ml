type graphe = bool array array;;
let adj_to_list g =
    let n = Array.length g in
    let t = Array.make n [] in
    for i = 0 to (n-1) do
        for j = 0 to (n-1) do
            if g.(i).(j) then t.(i) <- j::t.(i)
        done
    done;
    t;;
let list_to_adj t =
    let n = Array.length t in
    let g = Array.make_matrix n n false in
    let rec ajoute l i = match l with
        [] -> ()
        |(j::q) -> g.(i).(j) <- true ; ajoute q i
    in
    for i = 0 to (n - 1) do
        ajoute t.(i) i
    done;
    g;;
list_to_adj ( adj_to_list [|[|true;true;false|];[|true;false;true|];[|false;true;false|]|];;
list_to_adj ( adj_to_list [|[|true;true;false|];[|true;false;true|];[|false;true;false|]|]);;
