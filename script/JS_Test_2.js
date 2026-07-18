class MyClass {

    static getKey(password)
    {
        const length = password.length;

        let key = "";

        for(let i = 0; i < length; i++)
        {
            let code = 2000;

            for(let k = 0; k < length; k++)
            {
                if(k != i) code += password.charCodeAt(k);
            }

            key += String.fromCharCode(code);
        }

        console.log("key -> " + key);

        return key;
    }

    static Coder(password, text) {

        const key = this.getKey(password);

        const textBytes = new TextEncoder().encode(text);
        const keyBytes = new TextEncoder().encode(key);

        const result = new Uint8Array(textBytes.length);

        for (let i = 0; i < textBytes.length; i++) {
            result[i] = textBytes[i] ^ keyBytes[i % keyBytes.length];
        }

        return btoa(String.fromCharCode(...result));

    }

    static DeCoder(password, cipher) {

        const key = this.getKey(password);

        const cipherBytes = Uint8Array.from(
            atob(cipher),
            c => c.charCodeAt(0)
        );

        const keyBytes = new TextEncoder().encode(key);

        const result = new Uint8Array(cipherBytes.length);

        for (let i = 0; i < cipherBytes.length; i++) {
            result[i] = cipherBytes[i] ^ keyBytes[i % keyBytes.length];
        }

        return new TextDecoder().decode(result);

    }
}






