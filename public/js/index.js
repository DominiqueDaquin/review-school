function inclusion(file,elementId){
    fetch(file)
    .then((response)=>{
        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
        return response.text()
    })
    .then((data)=>{
        const element=document.getElementById(elementId)
        element.innerHTML=data
    })
    .catch(error=>{
        console.error('Une erreur est survenue lors de l\'inclusion');
        
    })
}

inclusion('../../src/components/header.html','main-header')