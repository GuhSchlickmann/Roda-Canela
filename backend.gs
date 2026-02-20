const FOLDER_ID = ''; 

function doGet(e) {
  return ContentService.createTextOutput("✅ Backend Roda Canela está ONLINE e pronto para receber dados!")
    .setMimeType(ContentService.MimeType.TEXT);
}

function initHeaders() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getActiveSheet();
    setupSheet(sheet);
    return "Cabeçalhos criados com sucesso!";
  } catch (e) {
    return "Erro: " + e.toString();
  }
}

function doPost(e) {
  try {
    let data;
    // O Google Apps Script popula e.parameter quando recebe application/x-www-form-urlencoded
    if (e.parameter && e.parameter.payload) {
      data = JSON.parse(e.parameter.payload);
    } else if (e.postData && e.postData.contents) {
      // Fallback para JSON direto no corpo
      try {
        data = JSON.parse(e.postData.contents);
      } catch(ex) {
        // Fallback para parâmetros se não for JSON
        data = e.parameter;
      }
    } else {
      data = e.parameter;
    }
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getActiveSheet();
    
    setupSheet(sheet);
    
    // 2. Processar fotos se houver
    let photoUrls = [];
    if (data.photos && data.photos.length > 0) {
      data.photos.forEach((photo, index) => {
        let folder;
        try {
          if (FOLDER_ID && FOLDER_ID.length > 15) {
            folder = DriveApp.getFolderById(FOLDER_ID);
          } else {
            folder = DriveApp.getRootFolder();
          }
        } catch (fError) {
          folder = DriveApp.getRootFolder();
        }

        const contentType = photo.type;
        const decode64 = Utilities.base64Decode(photo.base64);
        const fileName = `feedback_${data.userName || 'anonimo'}_${index}_${Date.now()}`;
        const blob = Utilities.newBlob(decode64, contentType, fileName);
        const file = folder.createFile(blob);
        photoUrls.push(file.getUrl());
      });
    }

    // 3. Salvar na Planilha
    sheet.appendRow([
      new Date(), 
      data.rating,
      data.feedback,
      data.visitTime,
      data.waitTime,
      data.recommendAdvance,
      data.userName || 'Anônimo',
      data.userEmail || '',
      photoUrls.join(', '),
      data.userAgent || ''
    ]);
    
    sheet.autoResizeColumns(1, 10);

    return ContentService.createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    console.error('Erro no processamento:', error);
    return ContentService.createTextOutput(JSON.stringify({ result: 'error', error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function setupSheet(sheet) {
  if (sheet.getLastRow() === 0) {
    const headers = [
      "Data/Hora", "Nota", "Comentário", "Quando Visitou", 
      "Tempo de Espera", "Recomenda?", "Cliente", "E-mail", 
      "Fotos/Vídeos (Links)", "Dispositivo"
    ];
    sheet.appendRow(headers);
    const range = sheet.getRange(1, 1, 1, headers.length);
    range.setFontWeight("bold")
         .setBackground("#2c3e50")
         .setFontColor("#ffffff")
         .setHorizontalAlignment("center");
    sheet.setFrozenRows(1);
  }
}
