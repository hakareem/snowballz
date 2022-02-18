
export async function fetchObject(url: string, payload: any) {
    const method = "POST"
    const headers = { 'Accept': 'text/html', 'Content-Type': 'application/json' }
    const response = await fetch(url, { method: method, body: JSON.stringify(payload), headers: headers })
    //const response = await fetch(url, {method:method,headers:{'Accept':'text/html','Content-Type':'application/json'}})
    if (response.ok) {
        return await response.json()
    }
    else {
        console.log(`unexpected response status ${response.status} + ${response.statusText}`)
    }
}
