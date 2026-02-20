<script>
    // Configurações da API de Clima - Garça, SP, Brasil
    const API_KEY = "bed96f1025620d784160d45025ba9a6a"; 
    // Usando lat/lon de Garça-SP para evitar conflito com outras cidades
    const LAT = "-22.2106";
    const LON = "-49.6562";

    async function atualizarClima() {
        try {
            // Chamada usando coordenadas para precisão total
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&units=metric&lang=pt_br&appid=${API_KEY}`);
            const data = await response.json();

            if (data.cod !== 200) {
                console.warn("Erro na API:", data.message);
                return;
            }

            // Variáveis extraídas
            const temp = data.main.temp;
            const tempMax = data.main.temp_max;
            const tempMin = data.main.temp_min;
            const umidade = data.main.humidity;
            const condicao = data.weather[0].description;
            const iconCode = data.weather[0].icon;

            const container = document.getElementById('container-clima');
            const alertaBox = document.getElementById('alerta-clima');
            const textoAlerta = document.getElementById('texto-clima');
            const iconDiv = document.getElementById('icon-clima');

            container.classList.remove('d-none');

            // Atualiza Ícone e Título
            iconDiv.innerHTML = `<img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" width="60" alt="clima">`;
            document.getElementById('titulo-alerta').innerHTML = `Clima em Garça / SP`;
            
            // Monta o resumo
            const resumoClima = `
                <div class="mb-1">
                    <span class="fw-bold fs-3">${temp.toFixed(1)}°C</span> 
                    <span class="text-capitalize small ms-2 text-secondary">${condicao}</span>
                </div>
                <div class="small text-muted">
                    <i class="bi bi-arrow-up text-danger"></i> Máx: ${tempMax.toFixed(0)}° 
                    <i class="bi bi-arrow-down text-primary"></i> Mín: ${tempMin.toFixed(0)}° 
                    <i class="bi bi-droplets ms-2"></i> Umidade: ${umidade}%
                </div>
            `;
            
            // Inteligência AgroData
            let mensagemTecnica = "";
            let statusClass = "";

            if (temp > 30 && umidade < 45) {
                statusClass = "alert-danger border-danger";
                mensagemTecnica = `<strong>ALERTA CRÍTICO:</strong> Risco alto de <strong>Bicho-Mineiro</strong>.`;
            } else if (umidade > 80 && temp >= 18 && temp <= 24) {
                statusClass = "alert-warning border-warning";
                mensagemTecnica = `<strong>MONITORAMENTO:</strong> Favorável à <strong>Ferrugem</strong>.`;
            } else if (temp < 13) {
                statusClass = "alert-info border-info";
                mensagemTecnica = `<strong>AVISO:</strong> Baixa temperatura. Metabolismo do café reduzido.`;
            } else {
                statusClass = "alert-success border-success";
                mensagemTecnica = `<strong>ESTÁVEL:</strong> Condições ideais para o manejo atual.`;
            }

            // Aplica a classe de alerta e insere o texto
            alertaBox.className = `alert shadow-sm border-start border-4 ${statusClass}`;
            textoAlerta.innerHTML = `
                ${resumoClima}
                <div class="mt-2 pt-2 border-top text-dark">${mensagemTecnica}</div>
            `;

        } catch (err) {
            console.error("Erro AgroData Weather:", err);
        }
    }

    if ("serviceWorker" in navigator) {
        window.addEventListener("load", () => {
            navigator.serviceWorker.register("sw.js").catch(err => console.log(err));
        });
    }

    atualizarClima();
</script>
