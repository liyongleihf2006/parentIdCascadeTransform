/**
 * Created by LiYonglei on 2016/12/30.
 */
/*
 * 由parentId格式的数据向cascade格式的数据转化
 * params:
 *       datas:要转化的数据
 *       id:每一项的索引键名,default:"id"
 *       pid:每一项的父索引键名,default:"pid"
 *       rootId:根元素的索引值,default:0,其实就是决定哪些元素放到最上层的数组中去
 *       childrenKey:指向子数组的键名,default:"children"
 * */
function parentIdToCascade(datas, id, pid, rootId, childrenKey) {
    datas = JSON.parse(JSON.stringify(datas));
    id = id || "id";
    pid = pid || "pid";
    rootId = rootId || 0;
    childrenKey = childrenKey || "children";
    return transform();
    function transform(parentItem) {
        var children = datas.reduceRight(function (target, item, idx) {
            if (parentItem ? item[pid] == parentItem[id] : item[pid] == rootId||!item[pid]) {
                [].push.apply(target, datas.splice(idx, 1));
            };
            return target;
        }, []);
        children.forEach(function (item) {
            transform(item);
        });
        if (!parentItem) {
            return children;
        } else if (children.length) {
            parentItem[childrenKey] = children;
        }
    };
};
/*
 * 由cascade格式的数据向parentId格式的数据转化
 * params:
 *       datas:要转化的数据
 *       id:每一项的索引键名,default:"id"
 *       pid:指向父元素的索引键名,default:"pid"
 *       rootId:根元素的索引值,default:0,其实就是最顶层元素的父索引的值
 *       childrenKey:指向子数组的键名,default:"children"
 * */
function cascadeToParentId(datas, id, pid, rootId, childrenKey) {
    datas = JSON.parse(JSON.stringify(datas));
    id = id || "id";
    pid = pid || "pid";
    rootId = rootId || 0;
    childrenKey = childrenKey || "children";
    var arr = [];
    datas.forEach(function(item){
        item[pid]=rootId;
        arr.push(item);
        transform(item);
    });
    return arr;
    function transform(parentItem) {
        (parentItem[childrenKey] || []).forEach(function (item) {
            item[pid] = parentItem[id];
            arr.push(item);
            transform(item);
        });
        delete parentItem[childrenKey];
    };
};
