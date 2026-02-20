<script>
    // Configurações da API de Clima - Garça, SP, Brasil
    const API_KEY = "bed96f1025620d784160d45025ba9a6a"; 
    const LAT = "-22.2106";
    const LON = "-49.6562";

    async function atualizarClima() {
        try {
            // Mudamos para o endpoint 'forecast' para obter as variações reais de temp do dia
            const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&units=metric&lang=pt_br&appid=${API_KEY}`);
            const data = await response.json();

            if (data.cod !== "200") {
                console.warn("Erro na API:", data.message);
                return;
            }

            // Dados Atuais (Primeiro item da lista)
            const atual = data.list[0];
            const tempAtual = atual.main.temp;
            const umidade = atual.main.humidity;
            const condicao = atual.weather[0].description;
            const iconCode = atual.weather[0].icon;

            // LÓGICA PARA MÁXIMA E MÍNIMA REAL:
            // Percorremos as próximas 24 horas (os primeiros 8 registros de 3h) 
            // para encontrar os picos reais de temperatura.
            let tempMaxReal = -100;
            let tempMinReal = 100;

            for (let i = 0; i < 8; i++) {
                const item = data.list[i].main;
                if (item.temp_max > tempMaxReal) tempMaxReal = item.temp_max;
                if (item.temp_min < tempMinReal) tempMinReal = item.temp_min;
            }

            const container = document.getElementById('container-clima');
            const alertaBox = document.getElementById('alerta-clima');
            const textoAlerta = document.getElementById('texto-clima');
            const iconDiv = document.getElementById('icon-clima');

            container.classList.remove('d-none');

            // Atualiza Ícone e Título
            iconDiv.innerHTML = `<img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" width="60" alt="clima">`;
            document.getElementById('titulo-alerta').innerHTML = `Clima em Garça / SP`;
            
            // Monta o resumo com as temperaturas calculadas corretamente
            const resumoClima = `
                <div class="mb-1">
                    <span class="fw-bold fs-3">${tempAtual.toFixed(1)}°C</span> 
                    <span class="text-capitalize small ms-2 text-secondary">${condicao}</span>
                </div>
                <div class="small text-muted">
                    <i class="bi bi-arrow-up text-danger"></i> Máx Hoje: ${tempMaxReal.toFixed(0)}° 
                    <i class="bi bi-arrow-down text-primary"></i> Mín Hoje: ${tempMinReal.toFixed(0)}° 
                    <i class="bi bi-droplets ms-2"></i> Umidade: ${umidade}%
                </div>
            `;
            
            // Inteligência AgroData baseada na temperatura atual
            let mensagemTecnica = "";
            let statusClass = "";

            if (tempAtual > 30 && umidade < 45) {
                statusClass = "alert-danger border-danger";
                mensagemTecnica = `<strong>ALERTA CRÍTICO:</strong> Risco alto de <strong>Bicho-Mineiro</strong>.`;
            } else if (umidade > 80 && tempAtual >= 18 && tempAtual <= 24) {
                statusClass = "alert-warning border-warning";
                mensagemTecnica = `<strong>MONITORAMENTO:</strong> Favorável à <strong>Ferrugem</strong>.`;
            } else if (tempAtual < 13) {
                statusClass = "alert-info border-info";
                mensagemTecnica = `<strong>AVISO:</strong> Baixa temperatura. Metabolismo do café reduzido.`;
            } else {
                statusClass = "alert-success border-success";
                mensagemTecnica = `<strong>ESTÁVEL:</strong> Condições ideais para o manejo atual.`;
            }

            alertaBox.className = `alert shadow-sm border-start border-4 ${statusClass}`;
            textoAlerta.innerHTML = `
                ${resumoClima}
                <div class="mt-2 pt-2 border-top text-dark">${mensagemTecnica}</div>
            `;

        } catch (err) {
            console.error("Erro AgroData Weather Forecast:", err);
        }
    }

    if ("serviceWorker" in navigator) {
        window.addEventListener("load", () => {
            navigator.serviceWorker.register("sw.js").catch(err => console.log(err));
        });
    }

    atualizarClima();
</script>
