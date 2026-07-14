class MyClass {

    /*
     static DeCoder(kay, str) {
         let lengthKay = kay.length; // ����� �����
     
         let StringCode = "";
     
         for (let i = 0, count = 0; i < str.length; i++, count++) {
             if (count >= lengthKay) count = 0;
     
             let charCode = str.charCodeAt(i);
             let charCodeKay = kay.charCodeAt(count);
     
     
     
             charCode -= (charCodeKay + lengthKay);
     
             StringCode += String.fromCharCode(charCode);
         }
     
         return StringCode;
     
     }
     */

    static async getKey(password) {
        const encoder = new TextEncoder();

        // Получаем хеш SHA-256 от пароля
        const hash = await crypto.subtle.digest(
            "SHA-256",
            encoder.encode(password)
        );

        // Создаем AES-ключ
        return crypto.subtle.importKey(
            "raw",
            hash,
            { name: "AES-GCM" },
            false,
            ["encrypt", "decrypt"]
        );
    }

    static async encrypt(text, password) {

        const key = await this.getKey(password);

        const iv = crypto.getRandomValues(new Uint8Array(12));

        const encrypted = await crypto.subtle.encrypt(
            {
                name: "AES-GCM",
                iv: iv
            },
            key,
            new TextEncoder().encode(text)
        );

        // Соединяем IV и зашифрованные данные
        const result = new Uint8Array(iv.length + encrypted.byteLength);

        result.set(iv);
        result.set(new Uint8Array(encrypted), iv.length);

        // В Base64
        return btoa(String.fromCharCode(...result));
    }

    static async decrypt(base64, password) {

        const key = await this.getKey(password);

        const bytes = Uint8Array.from(
            atob(base64),
            c => c.charCodeAt(0)
        );

        const iv = bytes.slice(0, 12);
        const data = bytes.slice(12);

        const decrypted = await crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv: iv
            },
            key,
            data
        );

        return new TextDecoder().decode(decrypted);
    }

}






