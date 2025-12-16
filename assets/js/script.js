// Estado global da aplicação
let currentStep = 1;

// Configuração dos problemas e suas soluções
const diagnosticos = {
    lento: {
        titulo: 'Lentidão do Sistema',
        causas: [
            'Falta de memória RAM disponível',
            'HD cheio ou fragmentado',
            'Muitos programas iniciando com o Windows',
            'Possível malware consumindo recursos'
        ],
        solucoes: [
            'Desative programas desnecessários na inicialização',
            'Limpe arquivos temporários (use Limpeza de Disco)',
            'Verifique espaço disponível no HD (mínimo 15% livre)',
            'Execute um scan completo com antivírus',
            'Considere adicionar mais RAM se < 8GB'
        ]
    },
    travamento: {
        titulo: 'Travamentos Frequentes',
        causas: [
            'Memória RAM com defeito',
            'Superaquecimento de componentes',
            'Drivers desatualizados ou conflitantes',
            'HD/SSD com problemas'
        ],
        solucoes: [
            'Verifique temperatura dos componentes',
            'Atualize todos os drivers (especialmente GPU)',
            'Execute teste de memória RAM (Windows Memory Diagnostic)',
            'Verifique saúde do HD/SSD (CrystalDiskInfo)'
        ]
    },
    'tela-azul': {
        titulo: 'Tela Azul da Morte (BSOD)',
        causas: [
            'Problema de hardware (RAM, HD, placa-mãe)',
            'Driver incompatível ou corrompido',
            'Atualização mal instalada do Windows',
            'Superaquecimento crítico'
        ],
        solucoes: [
            'Anote o código de erro da tela azul',
            'Desinstale atualizações recentes do Windows',
            'Atualize BIOS/UEFI (avançado)',
            'Teste memória RAM individualmente',
            'Restaure o sistema para ponto anterior'
        ]
    },
    superaquecimento: {
        titulo: 'Superaquecimento',
        causas: [
            'Ventoinhas sujas ou com defeito',
            'Pasta térmica ressecada',
            'Falta de ventilação adequada',
            'Uso em superfícies que bloqueiam ventilação (notebooks)'
        ],
        solucoes: [
            'Limpe ventoinhas e saídas de ar',
            'Troque pasta térmica (se > 2 anos)',
            'Use base refrigerada (notebooks)',
            'Monitore temperatura (HWMonitor)',
            'Evite superfícies que bloqueiem ventilação'
        ]
    },
    virus: {
        titulo: 'Suspeita de Vírus/Malware',
        causas: [
            'Antivírus desatualizado ou inativo',
            'Download de arquivos suspeitos',
            'Navegação em sites não seguros',
            'Pendrives infectados'
        ],
        solucoes: [
            'Execute scan completo com antivírus atualizado',
            'Use ferramenta adicional (Malwarebytes)',
            'Remova extensões suspeitas do navegador',
            'Desinstale programas instalados recentemente',
            'Troque senhas importantes após limpeza'
        ]
    },
    internet: {
        titulo: 'Problemas de Conexão',
        causas: [
            'Problema no modem/roteador',
            'Driver da placa de rede desatualizado',
            'Interferência em redes Wi-Fi',
            'Malware afetando a conexão'
        ],
        solucoes: [
            'Reinicie modem e roteador',
            'Atualize driver da placa de rede',
            'Teste conexão via cabo (descartar problema Wi-Fi)',
            'Execute troubleshooter de rede do Windows',
            'Verifique se há malware afetando conexão'
        ]
    },
    barulho: {
        titulo: 'Barulhos Estranhos',
        causas: [
            'Ventoinha com defeito ou suja',
            'HD com problema mecânico',
            'Componente solto na placa-mãe',
            'Fonte de alimentação com problema'
        ],
        solucoes: [
            'Identifique a origem do barulho',
            'Limpe ventoinhas e componentes',
            'Verifique se há componentes soltos',
            'Teste fonte de alimentação',
            'Consulte um técnico se persistir'
        ]
    },
    'nao-liga': {
        titulo: 'PC Não Liga',
        causas: [
            'Problema na fonte de alimentação',
            'Cabo de força danificado',
            'Problema na placa-mãe',
            'Curto-circuito em algum componente'
        ],
        solucoes: [
            'Verifique se a tomada está funcionando',
            'Teste com outro cabo de força',
            'Verifique fonte de alimentação',
            'Desconecte periféricos e tente ligar',
            'Consulte um técnico - pode ser hardware'
        ]
    },
    outro: {
        titulo: 'Outro Problema',
        causas: [
            'Necessário mais informações para diagnóstico preciso'
        ],
        solucoes: [
            'Descreva o problema em detalhes',
            'Anote quando começou a acontecer',
            'Liste mudanças recentes no sistema',
            'Considere consultar um técnico'
        ]
    }
};

// Configuração de hardware por idade
const hardwareConfig = {
    'muito-antigo': {
        status: 'status-warning',
        texto: 'Upgrade Recomendado',
        mensagem: 'Seu computador tem mais de 5 anos. Considere:',
        recomendacoes: [
            'Upgrade de RAM (mínimo 8GB recomendado)',
            'Substituir HD por SSD (melhoria dramática)',
            'Considerar novo equipamento para tarefas pesadas'
        ]
    },
    antigo: {
        status: 'status-warning',
        texto: 'Bom Estado',
        mensagem: 'Hardware com 3-5 anos. Upgrades recomendados:',
        recomendacoes: [
            'Adicionar mais RAM se necessário',
            'Considerar SSD se ainda usa HD',
            'Manutenção preventiva (limpeza, pasta térmica)'
        ]
    },
    medio: {
        status: 'status-good',
        texto: 'Bom Estado',
        mensagem: 'Hardware relativamente novo. Foque em:',
        recomendacoes: [
            'Manutenção de software',
            'Otimização do sistema operacional',
            'Limpeza física regular'
        ]
    },
    novo: {
        status: 'status-good',
        texto: 'Bom Estado',
        mensagem: 'Hardware novo. Foque em:',
        recomendacoes: [
            'Manutenção de software',
            'Otimização do sistema operacional',
            'Limpeza física regular'
        ]
    }
};

/**
 * Valida um passo do formulário
 * @param {number} step - Número do passo
 * @returns {boolean} - true se válido, false caso contrário
 */
function validateStep(step) {
    clearErrors();
    
    if (step === 1) {
        const sistema = document.getElementById('sistema');
        const tipoPc = document.getElementById('tipo-pc');
        const idadePc = document.getElementById('idade-pc');
        
        let isValid = true;
        
        if (!sistema.value) {
            showError('sistema', 'Por favor, selecione o sistema operacional');
            isValid = false;
        }
        
        if (!tipoPc.value) {
            showError('tipo-pc', 'Por favor, selecione o tipo de computador');
            isValid = false;
        }
        
        if (!idadePc.value) {
            showError('idade-pc', 'Por favor, selecione a idade do computador');
            isValid = false;
        }
        
        return isValid;
    }
    
    if (step === 2) {
        const problema = document.getElementById('problema-principal');
        const quando = document.getElementById('quando-ocorre');
        const duracao = document.getElementById('duracao');
        
        let isValid = true;
        
        if (!problema.value) {
            showError('problema-principal', 'Por favor, selecione o problema principal');
            isValid = false;
        }
        
        if (!quando.value) {
            showError('quando-ocorre', 'Por favor, informe quando ocorre');
            isValid = false;
        }
        
        if (!duracao.value) {
            showError('duracao', 'Por favor, informe há quanto tempo acontece');
            isValid = false;
        }
        
        return isValid;
    }
    
    if (step === 3) {
        const antivirus = document.getElementById('antivirus');
        const atualizacoes = document.getElementById('atualizacoes');
        
        let isValid = true;
        
        if (!antivirus.value) {
            showError('antivirus', 'Por favor, informe sobre o antivírus');
            isValid = false;
        }
        
        if (!atualizacoes.value) {
            showError('atualizacoes', 'Por favor, informe sobre as atualizações');
            isValid = false;
        }
        
        return isValid;
    }
    
    return true;
}

/**
 * Exibe mensagem de erro para um campo
 * @param {string} fieldId - ID do campo
 * @param {string} message - Mensagem de erro
 */
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const formGroup = field.closest('.form-group');
    
    formGroup.classList.add('error');
    
    // Remove mensagem de erro existente
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Adiciona nova mensagem de erro
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.setAttribute('role', 'alert');
    errorDiv.textContent = message;
    formGroup.appendChild(errorDiv);
    
    // Foca no campo com erro
    field.setAttribute('aria-invalid', 'true');
    field.focus();
}

/**
 * Limpa todas as mensagens de erro
 */
function clearErrors() {
    document.querySelectorAll('.form-group.error').forEach(group => {
        group.classList.remove('error');
        const errorMsg = group.querySelector('.error-message');
        if (errorMsg) {
            errorMsg.remove();
        }
        const field = group.querySelector('select, textarea, input');
        if (field) {
            field.removeAttribute('aria-invalid');
        }
    });
}

/**
 * Avança para o próximo passo
 * @param {number} step - Número do próximo passo
 */
function nextStep(step) {
    if (!validateStep(currentStep)) {
        // Scroll para o primeiro erro
        const firstError = document.querySelector('.form-group.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
    }
    
    document.getElementById(`step-${currentStep}`).classList.remove('active');
    document.getElementById(`step-${step}`).classList.add('active');
    document.getElementById(`step-indicator-${step}`).classList.add('completed');
    currentStep = step;
    
    // Atualiza progresso acessível
    const progressContainer = document.querySelector('.progress-container');
    if (progressContainer) {
        progressContainer.setAttribute('aria-valuenow', step);
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Volta para o passo anterior
 * @param {number} step - Número do passo anterior
 */
function previousStep(step) {
    clearErrors();
    document.getElementById(`step-${currentStep}`).classList.remove('active');
    document.getElementById(`step-${step}`).classList.add('active');
    document.getElementById(`step-indicator-${currentStep}`).classList.remove('completed');
    currentStep = step;
    
    // Atualiza progresso acessível
    const progressContainer = document.querySelector('.progress-container');
    if (progressContainer) {
        progressContainer.setAttribute('aria-valuenow', step);
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Gera o diagnóstico completo baseado nas respostas
 */
function gerarDiagnostico() {
    if (!validateStep(3)) {
        const firstError = document.querySelector('.form-group.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
    }
    
    const dados = {
        sistema: document.getElementById('sistema').value,
        tipoPc: document.getElementById('tipo-pc').value,
        idadePc: document.getElementById('idade-pc').value,
        problema: document.getElementById('problema-principal').value,
        quando: document.getElementById('quando-ocorre').value,
        duracao: document.getElementById('duracao').value,
        antivirus: document.getElementById('antivirus').value,
        atualizacoes: document.getElementById('atualizacoes').value,
        descricao: document.getElementById('descricao').value.trim()
    };
    
    const diagnosticoHTML = gerarHTMLDiagnostico(dados);
    document.getElementById('resultados').innerHTML = diagnosticoHTML;
    nextStep(4);
    
    // Anuncia aos leitores de tela
    const resultadosDiv = document.getElementById('resultados');
    resultadosDiv.setAttribute('role', 'status');
    resultadosDiv.setAttribute('aria-live', 'polite');
}

/**
 * Gera o HTML completo do diagnóstico
 * @param {Object} dados - Dados do formulário
 * @returns {string} - HTML do diagnóstico
 */
function gerarHTMLDiagnostico(dados) {
    const { problema, idadePc, antivirus, atualizacoes, descricao } = dados;
    const diagnostico = diagnosticos[problema] || diagnosticos.outro;
    const temProblemaSeguranca = antivirus === 'nao' || antivirus === 'desatualizado' || problema === 'virus';
    const hardwareInfo = hardwareConfig[idadePc] || hardwareConfig.medio;
    
    // Ajusta status de hardware se for problema crítico
    let hardwareStatus = hardwareInfo.status;
    let hardwareTexto = hardwareInfo.texto;
    if (problema === 'tela-azul' || problema === 'nao-liga') {
        hardwareStatus = 'status-critical';
        hardwareTexto = 'Atenção Necessária';
    }
    
    return `
        ${gerarDiagnosticoProblema(diagnostico)}
        ${gerarSolucoes(diagnostico)}
        ${temProblemaSeguranca ? gerarAlertaSeguranca(dados) : ''}
        ${gerarStatusHardware(hardwareStatus, hardwareTexto, hardwareInfo)}
        ${gerarQuandoProcurarTecnico()}
        ${gerarPrevencao()}
        ${descricao ? gerarDescricaoUsuario(descricao) : ''}
    `;
}

/**
 * Gera HTML do diagnóstico do problema
 */
function gerarDiagnosticoProblema(diagnostico) {
    const causasHTML = diagnostico.causas.map(causa => `<li>${causa}</li>`).join('');
    
    return `
        <div class="result-item">
            <h3>Diagnóstico Identificado</h3>
            <p><strong>Problema:</strong> ${diagnostico.titulo}</p>
            <p><strong>Possíveis Causas:</strong></p>
            <ul>${causasHTML}</ul>
        </div>
    `;
}

/**
 * Gera HTML das soluções recomendadas
 */
function gerarSolucoes(diagnostico) {
    const solucoesHTML = diagnostico.solucoes.map(solucao => `<li>${solucao}</li>`).join('');
    
    return `
        <div class="result-item">
            <h3>💡 Soluções Recomendadas</h3>
            <p><strong>Ações Imediatas:</strong></p>
            <ul>${solucoesHTML}</ul>
        </div>
    `;
}

/**
 * Gera HTML do alerta de segurança
 */
function gerarAlertaSeguranca(dados) {
    const { antivirus, atualizacoes, problema } = dados;
    const alertas = [];
    
    if (antivirus === 'nao') {
        alertas.push('<li><strong>CRÍTICO:</strong> Nenhum antivírus detectado. Instale imediatamente!</li>');
    }
    if (antivirus === 'desatualizado') {
        alertas.push('<li><strong>AVISO:</strong> Antivírus desatualizado. Atualize agora</li>');
    }
    if (atualizacoes === 'nao') {
        alertas.push('<li><strong>CRÍTICO:</strong> Windows desatualizado. Vulnerável a ataques</li>');
    }
    if (problema === 'virus') {
        alertas.push('<li><strong>URGENTE:</strong> Comportamento suspeito de malware detectado</li>');
    }
    
    if (alertas.length === 0) return '';
    
    return `
        <div class="security-alert" role="alert">
            <h4>⚠️ Alerta de Segurança</h4>
            <p>Detectamos possíveis vulnerabilidades no seu sistema:</p>
            <ul>${alertas.join('')}</ul>
            <p style="margin-top: 1rem;"><strong>Recomendação:</strong> Execute uma varredura completa imediatamente e mantenha seu sistema sempre atualizado.</p>
        </div>
    `;
}

/**
 * Gera HTML do status do hardware
 */
function gerarStatusHardware(status, texto, hardwareInfo) {
    const recomendacoesHTML = hardwareInfo.recomendacoes.map(rec => `<li>${rec}</li>`).join('');
    
    return `
        <div class="result-item">
            <h3>⚙️ Status do Hardware <span class="status ${status}">${texto}</span></h3>
            <p>${hardwareInfo.mensagem}</p>
            <ul>${recomendacoesHTML}</ul>
        </div>
    `;
}

/**
 * Gera HTML de quando procurar técnico
 */
function gerarQuandoProcurarTecnico() {
    return `
        <div class="result-item">
            <h3>🔧 Quando Procurar um Técnico?</h3>
            <p>Considere ajuda profissional se:</p>
            <ul>
                <li>As soluções acima não resolverem o problema</li>
                <li>Houver barulhos estranhos vindos do hardware</li>
                <li>O PC não ligar de forma alguma</li>
                <li>Telas azuis persistentes mesmo após reinstalação</li>
                <li>Suspeita de dano físico em componentes</li>
            </ul>
        </div>
    `;
}

/**
 * Gera HTML de prevenção
 */
function gerarPrevencao() {
    return `
        <div class="result-item">
            <h3>🛡️ Prevenção de Problemas Futuros</h3>
            <p><strong>Mantenha seu PC saudável:</strong></p>
            <ul>
                <li>Mantenha Windows e drivers sempre atualizados</li>
                <li>Use antivírus confiável e atualizado</li>
                <li>Faça limpeza física a cada 6 meses</li>
                <li>Evite sites e downloads suspeitos</li>
                <li>Faça backup regular dos dados importantes</li>
                <li>Não deixe o HD com menos de 15% de espaço livre</li>
                <li>Monitore temperatura em dias quentes</li>
            </ul>
        </div>
    `;
}

/**
 * Gera HTML da descrição do usuário se fornecida
 */
function gerarDescricaoUsuario(descricao) {
    return `
        <div class="result-item">
            <h3>📝 Sua Descrição</h3>
            <p>${descricao.replace(/\n/g, '<br>')}</p>
        </div>
    `;
}

/**
 * Reinicia o formulário para uma nova consulta
 */
function reiniciar() {
    currentStep = 1;
    clearErrors();
    
    document.getElementById('step-4').classList.remove('active');
    document.getElementById('step-1').classList.add('active');
    
    document.querySelectorAll('.progress-step').forEach(step => step.classList.remove('completed'));
    document.getElementById('step-indicator-1').classList.add('completed');
    
    document.querySelectorAll('select, textarea').forEach(el => el.value = '');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Limpa erros quando o usuário interage com os campos
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('select, textarea').forEach(field => {
        field.addEventListener('change', function() {
            const formGroup = this.closest('.form-group');
            if (formGroup && formGroup.classList.contains('error')) {
                formGroup.classList.remove('error');
                const errorMsg = formGroup.querySelector('.error-message');
                if (errorMsg) {
                    errorMsg.remove();
                }
                this.removeAttribute('aria-invalid');
            }
        });
    });
});

