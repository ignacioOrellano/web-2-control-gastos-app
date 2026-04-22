const formularioBuscarPorUsuario = document.forms["busquedauser"]
formularioBuscarPorUsuario.addEventListener('submit', mandarFormulario)


function mandarFormulario(event){
  event.preventDefault()

  const input = formularioBuscarPorUsuario["userid"]
  const usuarioID = input.value
  
  if(usuarioID){
    window.location.href = `/gastos/user/${usuarioID}`
  }
}