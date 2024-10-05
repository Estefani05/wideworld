/* eslint-disable no-unused-vars */


export async function GETmodule(request,updateFunction){
    let response;
    
    fetch(`http://localhost:8000/api/${request}`).then(res=>res.json()).then(data=>{response = data;
        updateFunction(response);
    }).catch(error => {
        console.error('Error:', error);
      });
      
}


export async function GETSpesificmodule(request,updateFunction){
    let response;
    
    fetch(`http://localhost:8000/api/${request}`).then(res=>res.json()).then(data=>{response = data;
        updateFunction(response);
    }).catch(error => {
        console.error('Error:', error);
      });
      
}


