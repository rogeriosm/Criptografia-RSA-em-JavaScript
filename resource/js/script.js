/*
 * encontra o valor de N
 * P * Q
 */
function calcularN(p, q)
{
    return p * q;
}

/*
 * encontra o valor de phi N
 * (P - 1) * (Q - 1)
 */
function calcularTN(p, q)
{
    return (p - 1) * (q - 1);
}

/*
 * encontra o valor de E
 * 1 < e < phi n
 * essa função visa encontrar de forma crecente um valor (entre 2 e tn)
 * que seja coprimo de tn para E que satisfaça a condição MDC|e,tn| = 1
 */
function calcularE(tn)
{
    for (var i = 2; i < tn; i++) {
        var x = mdc(i, tn);
        //se x for igual a 1 então ele é coprimo de tn
        if (x === 1) {
            return i;
        }
    }

}

/*
 * encontra o valor de d
 * essa função busca encontrar o inverso multiplicativo modular de "e" e tn 
 * que satisfaça a condição d.e mod(tn) = 1 para encontrar a letra D
 * esse codigo foi encontrado no site stackoverflow postado pelo usuario Dipu
 * https://stackoverflow.com/users/1583052/dipu
 * https://stackoverflow.com/questions/26985808/calculating-the-modular-inverse-in-javascript#comment42505151_26985808
 */
function calcularD(a, m)
{
    // validate inputs
    [a, m] = [Number(a), Number(m)];
    if (Number.isNaN(a) || Number.isNaN(m)) {
        return "NaN"; // invalid input
    }
    a = (a % m + m) % m;
    if (!a || m < 2) {
        return "NaN"; // invalid input
    }
    // find the gcd
    const s = [];
    let b = m;
    while (b) {
        [a, b] = [b, a % b];
        s.push({a, b});
    }
    if (a !== 1) {
        return "NaN"; // inverse does not exists
    }
    // find the inverse
    let x = 1;
    let y = 0;
    for (let i = s.length - 2; i >= 0; --i) {
        [x, y] = [y, x - y * Math.floor(s[i].a / s[i].b)];
    }
    return (y % m + m) % m;
}

/*criptografando o texto*/
function criptografarMsg()
{
    var vetorPreCript = textAndAscii(getValores().msgPrincipal, 'string', 'ascii');
    var vetorCript = criptografar(vetorPreCript, getValores().e, getValores().n);
    //jogando os valores nos inputs
    document.getElementById('msgPreCript').value = vetorPreCript;
    document.getElementById('msgCript').value = vetorCript;
}

/*criptografando o texto preCriptografado*/
function criptografar(msgPreCriptografada, e, n)
{
    var msgCriptografada = new Array();
    for (var i = 0; i < msgPreCriptografada.length; i++)
    {
        var x = new BigNumber(msgPreCriptografada[i]);
        //erro?
        var pow = x.exponentiatedBy(e).modulo(n);
        msgCriptografada[i] = pow;

    }
    return msgCriptografada;
}

/*descriptografando o texto Criptografado para texto normal*/
function descriptografarMsg10()
{
    /*transforma a mensagem Criptografada em preCriptografada*/
    var msgPreDescript = descriptografar(getValores().msgCriptForDesCript, getValores().d, getValores().n);
    /*transforma a preCriptografia em texto*/
    var vetorDescript = textAndAscii(msgPreDescript, 'ascii', 'string');

    //jogando os valores nos inputs
    document.getElementById('msgPreDescript').value = msgPreDescript;
    document.getElementById('msgDescript').value = vetorDescript;
}


/*função para retornar um vetor de texto ou numeros da tabela ASCII*/
function textAndAscii(msgPrincipal, vetorEntrada, vetorSaida)
{
    var msgPre = new Array();
    //essa string foi criado para retornar o texto original sem as virgulas
    //que são geradas quando e retornado um vetor
    var msgPre2 = '';
    for (var i = 0; i < msgPrincipal.length; i++)
    {
        for (var j = 0; j < tabelaAscii(vetorEntrada).length; j++)
        {
            if (msgPrincipal[i] == tabelaAscii(vetorEntrada)[j])
            {
                //aqui e feito o texte para saber se retorna o vetor ou a string
                if (vetorEntrada == "string") {
                    msgPre[i] = tabelaAscii(vetorSaida)[j];
                } else {
                    msgPre[i] = tabelaAscii(vetorSaida)[j];
                    msgPre2 = msgPre2 + msgPre[i];
                }
                break;
            }
        }
    }
    //aqui e feito o texte para saber se retorna o vetor ou a string
    if (vetorEntrada === "string") {
       return msgPre;
    } else {
        return msgPre2;
    }
    return msgPre;
}

/*descriptografando o texto Criptografado para preCriptografado*/
function descriptografar(msgCripto, d, n)
{
    var msgPre = new Array();

    for (var i = 0; i < msgCripto.length; i++) {
        var c = new BigNumber(parseInt(msgCripto[i]));
        var m = c.exponentiatedBy(d).modulo(n);
        //armazenando em um vetor a mensagem pre codificada
        msgPre[i] = m;
    }
    return msgPre;
}

/*essa função e responsavel por retornar um vetor de string ou um vetor de inteiros*/
function tabelaAscii(vetor)
{

    var string = [
        " ", "!", "\"", "#", "$", "%", "&", "'", "(", ")", "*", "+", ",", "-", ".", "/",
        "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
        ":", ";", "<", "=", ">", "?", "@",
        "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
        "[", "\\", "]", "^", "_", "\`",
        "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
        "{", "|", "}", "~",
        "Ç", "ü", "é", "â", "ä", "à", "å", "ç", "ê", "ë", "è", "ï", "î", "ì", "Ä", "Å", "É", "æ", "Æ", "ô", "ö", "ò", "û", "ù", "ÿ", "Ö", "Ü",
        "ø", "£", "Ø", "×", "ƒ",
        "á", "í", "ó", "ú", "ñ", "Ñ",
        "ª", "º", "¿", "®", "¬", "½", "¼", "¡", "«", "»",
        "Á", "Â", "À",
        "©", "¢", "¥", "ã", "Ã", "¤", "ð",
        "Ð", "Ê", "Ë", "È", "i", "Í", "Î", "Ï", "¦", "Ì", "Ó", "ß", "Ô", "Ò", "Õ", "Õ",
        "µ", "þ", "Þ",
        "Ú", "Û", "Ù", "ý", "Ý",
        "¯", "´", "-", "±", "‗", "¾", "¶", "§", "÷", "¸", "°", "¨", "·", "¹", "³", "²"];

    var ASCII = [
        32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47,
        48, 49, 50, 51, 52, 53, 54, 55, 56, 57,
        58, 59, 60, 61, 62, 63, 64,
        65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90,
        91, 92, 93, 94, 95, 96,
        97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122,
        123, 124, 125, 126,
        128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154,
        155, 156, 157, 158, 159,
        /*abaixo tem versoes diferentes de tabela*/
        160, 161, 162, 163, 164, 165,
        166, 167, 168, 169, 170, 171, 172, 173, 174, 175,
        181, 182, 183,
        184, 189, 190, 198, 199, 207, 208,
        209, 210, 211, 212, 213, 214, 215, 216, 221, 222, 224, 225, 226, 227, 228, 229,
        230, 231, 232,
        233, 234, 235, 236, 237,
        238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253];

    switch (vetor) {
        case "string":
            return string;
            break;

        case "ascii":
            return ASCII;
            break;

        default:
            alert("Esse vetor nao existe!");
            break;
    }
}

/*esse função e responsavel por chamar as funções na ordem correta*/
function mother()
{
    //pegando os valores dos inputs
    var p = parseInt(document.getElementById('p').value);
    var q = parseInt(document.getElementById('q').value);
    var n = '0';
    var tn = '0';
    var e = '0';
    var d = '0';

    //verifica as entradas de p e q para continuar
    if (validaEntrada(p, q)) {
        n = calcularN(p, q);
        tn = calcularTN(p, q);
        e = calcularE(tn);
        d = calcularD(e, tn);
    }

    //atribuindo os valores aos inputs 
    document.getElementById('n').value = n;
    document.getElementById('tn').value = tn;
    document.getElementById('e').value = e;
    document.getElementById('d').value = d;
}

//valida a entrada de p e q
function validaEntrada(p, q)
{
    if (isNaN(p) || isNaN(q)) {
        alert("P ou Q não pode estar vazio!");
        return false;
    }
    if (!isPrime(p)) {
        alert("O numero P não é primo");
        return false;
    }
    if (!isPrime(q)) {
        alert("O numero Q não é primo");
        return false;
    }
    if (p === q) {
        alert("Os numeros P e Q não podem ser iguas");
        return false;
    }
    return true;
}

/*
 * testa se n é numero primo
 */
function isPrime(n) {
    if (n < 2) {
        return false;
    }
    if (n !== Math.round(n)) {
        return false;
    }
    var isPrime = true;

    for (var i = 2; i <= Math.sqrt(n); i++) {
        if (n % i === 0) {
            return false;
        }
    }
    return isPrime;
}

/*
 * encontra o MDC entre dois numeros
 * caso de erro ela retorna 0
 */
function mdc(num1, num2)
{
    var resto;
    do {
        resto = num1 % num2;
        num1 = num2;
        num2 = resto;
    } while (resto !== 0);
    return num1;
}

/*esse função retorna os valores n, tn, e, n, msgPrincipal*/
function getValores()
{
    //pegando os valores dos inputs
    var p = parseInt(document.getElementById('p').value);
    var q = parseInt(document.getElementById('q').value);

    //verifica as entradas de p e q para continuar
    if (validaEntrada(p, q)) {
        var valores = {
            'n': parseInt(document.getElementById('n').value),
            'tn': parseInt(document.getElementById('tn').value),
            'e': parseInt(document.getElementById('e').value),
            'd': parseInt(document.getElementById('d').value),
            'msgPrincipal': document.getElementById('msgPrincipal').value,
            'msgCriptForDesCript': document.getElementById('msgCriptForDesCript').value.replace(/\s/g, '').split(",")
        };
    }
    return valores;
}