function rand_id(id_length){
    const digits = "0123456789";
    let result = "";

    for(let i=0; i<id_length; i++){
        result += digits[Math.floor(Math.random() * digits.length)];
    }

    return result;
}

module.exports.rand_id = rand_id;