// Inicia a lista pegando os dados salvos no navegador (ou cria uma vazia)
let cargas = JSON.parse(localStorage.getItem('logiagro_cargas')) || [];

// Função para alternar as abas
function mudarAba(aba, elemento) {
    // Esconde todas as telas e remove a classe 'ativa' dos botões
    document.querySelectorAll('.tela').forEach(t => t.classList.remove('ativa'));
    document.querySelectorAll('.aba-btn').forEach(b => b.classList.remove('ativa'));

    // Mostra a tela clicada e ativa o botão
    document.getElementById(`tela-${aba}`).classList.add('ativa');
    elemento.classList.add('ativa');

    // Se for a aba do caminhoneiro, atualiza a lista
    if (aba === 'caminhoneiro') {
        renderizarCargas();
    }
}

// Evento de envio do formulário do produtor
document.getElementById('form-carga').addEventListener('submit', function(e) {
    e.preventDefault(); // Impede a página de recarregar

    // Cria o objeto com os dados da carga
    const novaCarga = {
        id: Date.now(),
        produto: document.getElementById('produto').value,
        origem: document.getElementById('origem').value,
        destino: document.getElementById('destino').value,
        peso: document.getElementById('peso').value
    };

    // Adiciona na lista e salva no navegador
    cargas.push(novaCarga);
    localStorage.setItem('logiagro_cargas', JSON.stringify(cargas));

    // Mostra mensagem de sucesso
    const msg = document.getElementById('msg-sucesso');
    msg.style.display = 'block';
    msg.innerText = "✅ Carga publicada com sucesso! Aguarde um caminhoneiro.";
    
    // Limpa o formulário
    this.reset();

    // Esconde a mensagem depois de 4 segundos
    setTimeout(() => { msg.style.display = 'none'; }, 4000);
});

// Função que desenha as cargas na tela do caminhoneiro
function renderizarCargas() {
    const lista = document.getElementById('lista-cargas');
    lista.innerHTML = '';

    if (cargas.length === 0) {
        lista.innerHTML = '<p style="text-align:center; color:#777;">Nenhum frete disponível no momento. Volte mais tarde!</p>';
        return;
    }

    // Loop para criar um card para cada carga
    cargas.forEach(carga => {
        const card = document.createElement('div');
        card.className = 'card-carga';
        card.innerHTML = `
            <h3>${carga.produto} (${carga.peso} Ton)</h3>
            <p><strong>📍 Origem:</strong> ${carga.origem}</p>
            <p><strong>🎯 Destino:</strong> ${carga.destino}</p>
            <button class="btn-aceitar" onclick="aceitarFrete(${carga.id})">Aceitar Frete</button>
        `;
        lista.appendChild(card);
    });
}

// Função chamada quando o caminhoneiro clica em "Aceitar"
function aceitarFrete(id) {
    if (confirm("Deseja realmente aceitar este frete? O produtor será notificado.")) {
        // Filtra a lista, removendo a carga que foi aceita
        cargas = cargas.filter(carga => carga.id !== id);
        
        // Atualiza o navegador e a tela
        localStorage.setItem('logiagro_cargas', JSON.stringify(cargas));
        renderizarCargas();
        alert("🚛 Frete aceito com sucesso! Entre em contato com o produtor.");
    }
}