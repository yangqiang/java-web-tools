const TAB = "\t";

function upperFirst(k) {
    return k.substr(0, 1).toUpperCase() + k.substr(1, k.length - 1);
}

function toCamel(k) {
    let ret = "";
    let meetUnderscore = false;

    for (let i = 0; i < k.length; i++) {
        let c = k[i];
        if (c === "_") {
            meetUnderscore = true;
        } else {
            if (meetUnderscore) {
                c = c.toUpperCase();
                meetUnderscore = false;
            }
            ret += c;
        }
    }

    return ret;
}

function toSnake(k) {
    let ret = "";
    for (let i in k) {
        let c = k[i];
        if (c.toLowerCase() !== c) {
            ret += '_' + c.toLowerCase();
        } else {
            ret += c;
        }
    }
    return ret;
}

function getJavaBasicType(typeV) {
    if (typeV === 'number') {
        return "Double";
    } else if (typeV === 'integer') {
        return "Integer";
    } else if (typeV === 'string') {
        return "String"
    } else if (typeV === 'boolean') {
        return "Boolean"
    }
    return null;
}

function getSchemaType(v) {
    let typeV = typeof v;
    if (typeV === 'number' && String(v).indexOf(".") === -1) {
        typeV = "integer";
    }
    if (typeV === 'object' && v instanceof Array) {
        typeV = 'array';
    }
    return typeV;
}

function removePrefixAndPostfixSpace(line) {
    return line.replace(/^\s+/, '').replace(/\s+$/, '');
}

function removePrefixAndPostfixSep(line) {
    return line.replace(/^\|/, '').replace(/\|$/, '');
}


const mdUtil = {};
mdUtil.splitAndClean = function (line) {
    line = removePrefixAndPostfixSep(removePrefixAndPostfixSpace(line));

    let words = line.split('|');
    for (let i in words) {
        words[i] = removePrefixAndPostfixSpace(words[i]);
    }
    return words;
};

mdUtil.cleanType = function (t) {
    switch (t) {
        case 'int':
            return 'Integer';
        case 'long':
            return 'Long';
        default:
            return t;
    }
};