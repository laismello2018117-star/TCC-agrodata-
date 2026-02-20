<script>
    // Configurações da API de Clima
    const API_KEY = "bed96f1025620d784160d45025ba9a6a"; 
    const CIDADE = "Garça,BR";

    async function atualizarClima() {
        try {
            // Chamada para a API do OpenWeatherMap
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${CIDADE}&units=metric&lang=pt_br&appid=${API_KEY}`);
            const data = await response.json();

            if (data.cod !== 200) {
                console.warn("Não foi possível obter dados do clima.");
                return;
            }

            // Variáveis extraídas da API
            const temp = data.main.temp;
            const tempMax = data.main.temp_max;
            const tempMin = data.main.temp_min;
            const umidade = data.main.humidity;
            const condicao = data.weather[0].description;
            const iconCode = data.weather[0].icon;

            // Elementos do HTML
            const container = document.getElementById('container-clima');
            const alertaBox = document.getElementById('alerta-clima');
            const textoAlerta = document.getElementById('texto-clima');
            const iconDiv = document.getElementById('icon-clima');

            // Exibir o container
            container.classList.remove('d-none');

            // Atualiza Ícone e Dados de Temperatura
            iconDiv.innerHTML = `<img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" width="50" alt="clima">`;
            
            // Monta o resumo climático (Atual, Máx e Mín)
            const resumoClima = `
                <div class="mb-1">
                    <span class="fw-bold fs-4">${temp.toFixed(1)}°C</span> 
                    <span class="text-capitalize small ms-2">${condicao}</span>
                </div>
                <div class="small text-muted">
                    <i class="bi bi-arrow-up text-danger"></i> Máx: ${tempMax.toFixed(0)}° 
                    <i class="bi bi-arrow-down text-primary"></i> Mín: ${tempMin.toFixed(0)}° 
                    <i class="bi bi-droplets ms-2"></i> Umidade: ${umidade}%
                </div>
            `;
            
            // Insere no cabeçalho do alerta (substituindo o texto estático se desejar ou adicionando)
            document.getElementById('titulo-alerta').innerHTML = `Clima em ${data.name}`;
            
            // Lógica de Alerta Fitossanitário (Inteligência Agro)
            let mensagemTecnica = "";

            if (temp > 30 && umidade < 45) {
                alertaBox.className = "alert alert-danger shadow-sm border-start border-4 border-danger";
                mensagemTecnica = `<strong>ALERTA CRÍTICO:</strong> Clima favorável ao <strong>Bicho-Mineiro</strong>.`;
            } else if (umidade > 80 && temp >= 18 && temp <= 24) {
                alertaBox.className = "alert alert-warning shadow-sm border-start border-4 border-warning";
                mensagemTecnica = `<strong>MONITORAMENTO:</strong> Risco de <strong>Ferrugem</strong> devido à alta umidade.`;
            } else if (temp < 12) {
                alertaBox.className = "alert alert-info shadow-sm border-start border-4 border-info";
                mensagemTecnica = `<strong>AVISO:</strong> Temperaturas baixas. Crescimento vegetativo reduzido.`;
            } else {
                alertaBox.className = "alert alert-success shadow-sm border-start border-4 border-success";
                mensagemTecnica = `<strong>CONDIÇÕES OTIMAIS:</strong> Clima estável para o manejo do cafezal.`;
            }

            // Inserir os dados processados no HTML
            document.getElementById('texto-clima').innerHTML = `
                ${resumoClima}
                <div class="mt-2 pt-2 border-top text-dark">${mensagemTecnica}</div>
            `;

        } catch (err) {
            console.error("Erro na conexão com AgroData-Weather:", err);
        }
    }

    // Registro do Service Worker para PWA
    if ("serviceWorker" in navigator) {
        window.addEventListener("load", () => {
            navigator.serviceWorker.register("sw.js")
                .then(reg => console.log("Service Worker ativo!", reg.scope))
                .catch(err => console.log("Erro no Service Worker:", err));
        });
    }

    // Executa a função ao carregar a página
    atualizarClima();
</script>
