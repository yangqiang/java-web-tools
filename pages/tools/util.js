const TAB = "\t";

function upperFirst(k) {
    return k.substr(0, 1).toUpperCase() + k.substr(1, k.length - 1);
}

function contains(s, sub) {
    return s.indexOf(sub) > -1;
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

mdUtil.isTableName = function (line) {
    return line.startsWith('##');
};

mdUtil.getTableName = function (line) {
    let ret = {};
    line = line.replace(/^#+/, '');
    line = removePrefixAndPostfixSpace(line);
    const words = line.split(' ');
    ret.name = words[1];
    ret.description = words[0];
    return ret;
};

mdUtil.isTableSep = function (line) {
    return /-+\s*\|\s*-+/.test(line);
};

mdUtil.isField = function (line) {
    line = removePrefixAndPostfixSep(removePrefixAndPostfixSpace(line));
    return line.split('|').length > 1;
};

mdUtil.getField = function (line) {
    line = removePrefixAndPostfixSep(removePrefixAndPostfixSpace(line));

    const words = line.split('|');
    if (words.length < 2) {
        console.log('error parse field: ' + line);
    } else {
        let ret = {};
        ret.name = removePrefixAndPostfixSpace(words[0]);
        ret.type = removePrefixAndPostfixSpace(words[1]);
        ret.description = removePrefixAndPostfixSpace(words[2]);
        ret.null = words[3] !== undefined && words[3].indexOf('否') !== -1;
        return ret;
    }
    return undefined;
};

mdUtil.getTables = function (lines) {
    const lineList = lines.split('\n');
    let table = {};
    let fields = [];
    const ret = [];
    const status = {};
    status.meetTable = false;
    status.meetSep = false;
    status.meetField = false;

    for (const i in lineList) {
        let line = lineList[i];
        if (!status.meetTable) {
            if (!this.isTableName(line)) {
                continue;
            }
            table = this.getTableName(line);
            status.meetTable = true;
            fields = [];
        } else {
            if (!status.meetSep) {
                if (!this.isTableSep(line)) {
                    continue;
                }
                status.meetSep = true;
            } else {
                if (this.isField(line)) {
                    fields.push(this.getField(line));
                } else {
                    status.meetTable = false;
                    status.meetSep = false;
                    status.meetField = false;

                    ret.push({name: table, fields: fields});
                    table = {};
                    fields = [];

                    if (mdUtil.isTableName(line)) {
                        table = mdUtil.getTableName(line);
                        status.meetTable = true;
                    }
                }
            }
        }
    }
    if (fields.length > 0) {
        ret.push({name: table, fields: fields});
    }

    return ret;
};

function mysqlTypeToJavaType(t) {
    if (contains(t, "tinyint") || contains(t, "int")) {
        return "Integer";
    } else if (contains(t, "bigint")) {
        return "Long";
    } else if (contains(t, "bool")) {
        return "Boolean";
    } else if (contains(t, "datetime")) {
        return "Date";
    } else if (contains(t, "decimal")) {
        return "Double";
    } else if (contains(t, "char")|| contains(t, "json")) {
        return "String";
    } else {
        return t;
    }
}