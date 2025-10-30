class MyClass {
     
   static DeCoder(kay, str) {
       let lengthKay = kay.length; // длина ключа
   
       let StringCode = "";
   
       for (let i = 0, count = 0; i < str.length; i++, count++) {
           if (count >= lengthKay) count = 0;
   
           let charCode = str.charCodeAt(i);
           let charCodeKay = kay.charCodeAt(count);
   
   
   
           charCode -= charCodeKay;
   
           StringCode += String.fromCharCode(charCode);
       }
   
       return StringCode;
   
   }
 }






