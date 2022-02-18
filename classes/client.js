var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export function fetchObject(url, payload) {
    return __awaiter(this, void 0, void 0, function* () {
        const method = "POST";
        const headers = { 'Accept': 'text/html', 'Content-Type': 'application/json' };
        const response = yield fetch(url, { method: method, body: JSON.stringify(payload), headers: headers });
        //const response = await fetch(url, {method:method,headers:{'Accept':'text/html','Content-Type':'application/json'}})
        if (response.ok) {
            return yield response.json();
        }
        else {
            console.log(`unexpected response status ${response.status} + ${response.statusText}`);
        }
    });
}
//# sourceMappingURL=client.js.map