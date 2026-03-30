/**
 * Parser para processar conteúdo de notícias com suporte a subtítulos
 * Formato: [SUBTITLE]Seu subtítulo aqui
 */

export function parsePostContent(content) {
    if (!content) return '';
    
    // Dividir o conteúdo em partes usando o marcador [SUBTITLE]
    const parts = content.split(/\[SUBTITLE\]/);
    
    let html = '';
    
    parts.forEach((part, index) => {
        if (index === 0) {
            // Primeiro parágrafo (antes de qualquer subtítulo)
            if (part.trim()) {
                html += `<p style="line-height: 1.6; margin-bottom: 15px; color: #ccc;">${formatarTexto(part.trim())}</p>`;
            }
        } else {
            // Partes após [SUBTITLE]
            const linhas = part.trim().split('\n');
            if (linhas.length > 0) {
                // Primeira linha é o subtítulo
                const subtitulo = linhas[0].trim();
                html += `<h3 style="color: var(--gold); font-size: 1.2rem; margin-top: 25px; margin-bottom: 12px; font-family: 'Playfair Display', serif;">${subtitulo}</h3>`;
                
                // Resto é conteúdo
                if (linhas.length > 1) {
                    const conteudoSubsecao = linhas.slice(1).join('\n').trim();
                    if (conteudoSubsecao) {
                        html += `<p style="line-height: 1.6; margin-bottom: 15px; color: #ccc;">${formatarTexto(conteudoSubsecao)}</p>`;
                    }
                }
            }
        }
    });
    
    return html;
}

function formatarTexto(texto) {
    // Escapar HTML
    texto = texto
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    
    // Converter quebras de linha em <br>
    texto = texto.replace(/\n/g, '<br>');
    
    // Suporte a **negrito**
    texto = texto.replace(/\*\*(.*?)\*\*/g, '<strong style="color: #d4af37;">$1</strong>');
    
    // Suporte a *itálico*
    texto = texto.replace(/\*(.*?)\*/g, '<em style="color: #bd9617;">$1</em>');
    
    return texto;
}

export function gerarPreviewPost(titulo, conteudo, imagemUrl) {
    return `
        <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(189, 150, 23, 0.2); border-radius: 15px; overflow: hidden; padding: 20px; margin-bottom: 30px;">
            ${imagemUrl ? `<img src="${imagemUrl}" alt="${titulo}" style="width: 100%; height: 300px; object-fit: cover; border-radius: 10px; margin-bottom: 20px;">` : ''}
            <h2 style="color: var(--gold); font-family: 'Playfair Display', serif; font-size: 1.8rem; margin-bottom: 15px;">${titulo}</h2>
            <div style="color: #ccc; line-height: 1.8;">
                ${parsePostContent(conteudo)}
            </div>
        </div>
    `;
}
