import QRCode from 'qrcode';

function gerar_pix_copiaecola(chave_pix, nome_recebedor, cidade_recebedor, valor = null, identificador = "***") {
    function format_field(id, content) {
        const length = String(content.length).padStart(2, '0');
        return `${id}${length}${content}`;
    }

    // Montagem do payload EMV
    let payload = "";
    payload += format_field("00", "01");
    payload += format_field("26",
        format_field("00", "br.gov.bcb.pix") +
        format_field("01", chave_pix)
    );
    payload += format_field("52", "0000");
    payload += format_field("53", "986");
    
    if (valor !== null) {
        payload += format_field("54", (parseFloat(valor)).toFixed(2));
    }
    
    payload += format_field("58", "BR");
    payload += format_field("59", nome_recebedor.substring(0, 25));
    payload += format_field("60", cidade_recebedor.substring(0, 15));
    payload += format_field("62", format_field("05", identificador));

    const payload_sem_crc = payload + "6304";
    const crc = calcular_crc16(payload_sem_crc);
    const payload_completo = payload_sem_crc + crc;
    return payload_completo;
}

function calcular_crc16(payload) {
    let crc = 0xFFFF;
    for (let ch of payload) {
        crc ^= ch.charCodeAt(0) << 8;
        for (let i = 0; i < 8; i++) {
            if (crc & 0x8000) {
                crc = ((crc << 1) ^ 0x1021) & 0xFFFF;
            } else {
                crc = (crc << 1) & 0xFFFF;
            }
        }
    }
    return crc.toString(16).toUpperCase().padStart(4, '0');
}

function gerar_qrcode_pix(codigo_pix, nome_arquivo = "qrcode_pix.png") {
    QRCode.toFile(nome_arquivo, codigo_pix, function (err) {
        if (err) throw err;
        console.log(`QR Code salvo como: ${nome_arquivo}`);
    });
}

// ==== EXEMPLO DE USO ====

const codigo_pix = gerar_pix_copiaecola(
    "+5543988030433",
    "ALEXANDRE FUZETI BERTIPAGLIA",
    "Londrina",
    1.01,
    "REC68713754E3DC"
);

gerar_qrcode_pix(codigo_pix);