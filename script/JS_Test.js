class MyClass {
     
    static async getKey(password) {
        const encoder = new TextEncoder();

        // РџРѕР»СѓС‡Р°РµРј С…РµС€ SHA-256 РѕС‚ РїР°СЂРѕР»СЏ
        const hash = await crypto.subtle.digest(
            "SHA-256",
            encoder.encode(password)
        );

        // РЎРѕР·РґР°РµРј AES-РєР»СЋС‡
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

        // РЎРѕРµРґРёРЅСЏРµРј IV Рё Р·Р°С€РёС„СЂРѕРІР°РЅРЅС‹Рµ РґР°РЅРЅС‹Рµ
        const result = new Uint8Array(iv.length + encrypted.byteLength);

        result.set(iv);
        result.set(new Uint8Array(encrypted), iv.length);

        // Р’ Base64
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






