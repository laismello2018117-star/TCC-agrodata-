<script>
    // Configurações da API de Clima - Garça, SP, Brasil
    const API_KEY = "bed96f1025620d784160d45025ba9a6a"; 
    const LAT = "-22.2106";
    const LON = "-49.6562";

    // FUNÇÃO DA CALCULADORA DE CALAGEM (Adicionada)
    function calcularCalagem() {
      const v1 = parseFloat(document.getElementById('v1').value);
      const v2 = parseFloat(document.getElementById('v2').value);
      const ctc = parseFloat(document.getElementById('ctc').value);
      const prnt = parseFloat(document.getElementById('prnt').value);

      // Mantendo a lógica de validação simples
      if (v1 >= 0 && v2 && ctc && prnt) {
        // NC (t/ha) = [(V2 - V1) * CTC] / PRNT
        let nc = ((v2 - v1) * ctc) / prnt;
        
        if (nc < 0) nc = 0;
        
        document.getElementById('valor-nc').innerText = nc.toFixed(2);
        document.getElementById('resultado-calc').classList.remove('d-none');
      } else {
        alert("Por favor, preencha todos os campos da análise de solo corretamente.");
      }
    }

    // FUNÇÃO DE CLIMA (Sua lógica atualizada com Forecast)
    async function atualizarClima() {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&units=metric&lang=pt_br&appid=${API_KEY}`);
            const data = await response.json();

            if (data.cod !== "200") {
                console.warn("Erro na API:", data.message);
                return;
            }

            const atual = data.list[0];
            const tempAtual = atual.main.temp;
            const umidade = atual.main.humidity;
            const condicao = atual.weather[0].description;
            const iconCode = atual.weather[0].icon;

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

            iconDiv.innerHTML = `<img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" width="60" alt="clima">`;
            document.getElementById('titulo-alerta').innerHTML = `Clima em Garça / SP`;
            
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
