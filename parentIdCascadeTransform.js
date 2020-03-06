/**
 * Created by LiYonglei on 2016/12/30.
 */
/*
    * 由pid格式的数据向cascade格式的数据转化
    * params:
    *       datas:要转化的数据
    *       id:每一项的索引键名,default:"id"
    *       pid:每一项的父索引键名,default:"pid"
    *       rootId:根元素的索引值,default:0,其实就是决定哪些元素放到最上层的数组中去
    *       childrenKey:指向子数组的键名,default:"children"
    * */
function parentIdToCascade(datas = [], id = 'id', pid = 'pid', rootId = -1, childrenKey = 'children') {
    // 为了防止改变原数据进行深copy,最好改成真正的深copy,而不是使用我下面这种写法
    datas = JSON.parse(JSON.stringify(datas))
    const res = []
    const map = datas.reduce((res, v) => {
        res[v[id]] = v
        return res
    }, {})
    for (const item of datas) {
        if (item[pid] == rootId) {
            res.push(item)
            continue
        }
        if (item[pid] in map) {
            const parent = map[item[pid]]
            parent[childrenKey] = parent[childrenKey] || []
            parent[childrenKey].push(item)
        }
    }
    return res
}
/*
    * 由cascade格式的数据向pid格式的数据转化
    * params:
    *       datas:要转化的数据
    *       id:每一项的索引键名,default:"id"
    *       pid:指向父元素的索引键名,default:"pid"
    *       rootId:根元素的索引值,default:0,其实就是最顶层元素的父索引的值
    *       childrenKey:指向子数组的键名,default:"children"
    * */
function cascadeToParentId(datas = [], id = 'id', pid = 'pid', rootId = -1, childrenKey = 'children') {
    // 为了防止改变原数据进行深copy,最好改成真正的深copy,而不是使用我下面这种写法
    datas = JSON.parse(JSON.stringify(datas));
    var arr = [];
    datas.forEach(function (item) {
        item[pid] = rootId;
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
