const fs = require('fs');
const path = require('path');

/**
 * HTML 파일에서 외부 요청을 일으키는 코드들을 제거하는 함수
 * @param {string} htmlContent - 원본 HTML 내용
 * @returns {string} - 정리된 HTML 내용
 */
function cleanHtmlContent(htmlContent) {
    let cleanedContent = htmlContent;
    
    // 1. script 태그 제거 (인라인 스크립트와 외부 스크립트 모두)
    cleanedContent = cleanedContent.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    
    // 2. noscript 태그 제거
    cleanedContent = cleanedContent.replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, '');
    
    // 3. iframe 태그 제거 (외부 사이트 임베드 방지)
    cleanedContent = cleanedContent.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
    
    // 4. form 태그의 action 속성 제거 (외부 전송 방지)
    cleanedContent = cleanedContent.replace(/(<form[^>]*)\s+action\s*=\s*["'][^"']*["']/gi, '$1');
    
    // 5. link 태그에서 외부 CSS 제거 (rel="stylesheet"이면서 외부 URL인 경우)
    cleanedContent = cleanedContent.replace(/<link[^>]*rel\s*=\s*["']stylesheet["'][^>]*href\s*=\s*["']https?:\/\/[^"']*["'][^>]*>/gi, '');
    
    // 6. img 태그에서 외부 이미지 src 제거
    cleanedContent = cleanedContent.replace(/(<img[^>]*)\s+src\s*=\s*["']https?:\/\/[^"']*["']/gi, '$1 src=""');
    
    // 7. a 태그에서 외부 링크 href 제거
    cleanedContent = cleanedContent.replace(/(<a[^>]*)\s+href\s*=\s*["']https?:\/\/[^"']*["']/gi, '$1 href="#"');
    
    // 8. meta 태그에서 리다이렉트 관련 제거
    cleanedContent = cleanedContent.replace(/<meta[^>]*http-equiv\s*=\s*["']refresh["'][^>]*>/gi, '');
    
    // 9. onclick, onload 등 이벤트 핸들러 제거
    cleanedContent = cleanedContent.replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, '');
    
    // 10. data- 속성 중 외부 요청 관련된 것들 제거
    cleanedContent = cleanedContent.replace(/\s+data-[^=]*=\s*["'][^"']*["']/gi, '');
    
    // 11. style 속성에서 background-image url() 제거
    cleanedContent = cleanedContent.replace(/background-image\s*:\s*url\s*\(\s*["']?https?:\/\/[^"')]*["']?\s*\)/gi, '');
    
    // 12. 정리 메시지 추가
    const cleaningNotice = `
    <!-- 
    ========================================
    이 파일은 html-cleaner.js에 의해 정리되었습니다.
    외부 요청을 일으킬 수 있는 다음 요소들이 제거되었습니다:
    - script 태그 (인라인 및 외부 스크립트)
    - noscript 태그
    - iframe 태그
    - 외부 CSS 링크
    - 외부 이미지 링크
    - 외부 사이트 링크
    - 이벤트 핸들러 (onclick, onload 등)
    - 리다이렉트 meta 태그
    - data- 속성들
    ========================================
    -->
    `;
    
    // head 태그 뒤에 정리 메시지 추가
    cleanedContent = cleanedContent.replace(/(<head[^>]*>)/i, `$1${cleaningNotice}`);
    
    return cleanedContent;
}

/**
 * HTML 파일을 정리하는 메인 함수
 * @param {string} inputFilePath - 입력 HTML 파일 경로
 * @param {string} outputFilePath - 출력 HTML 파일 경로 (선택사항)
 */
function cleanHtmlFile(inputFilePath, outputFilePath = null) {
    try {
        // 파일 존재 확인
        if (!fs.existsSync(inputFilePath)) {
            throw new Error(`파일을 찾을 수 없습니다: ${inputFilePath}`);
        }
        
        // HTML 파일 읽기
        console.log(`📖 HTML 파일 읽는 중: ${inputFilePath}`);
        const htmlContent = fs.readFileSync(inputFilePath, 'utf8');
        
        // HTML 내용 정리
        console.log('🧹 외부 요청 코드 제거 중...');
        const cleanedContent = cleanHtmlContent(htmlContent);
        
        // 출력 파일 경로 설정
        if (!outputFilePath) {
            const parsedPath = path.parse(inputFilePath);
            outputFilePath = path.join(parsedPath.dir, `${parsedPath.name}_cleaned${parsedPath.ext}`);
        }
        
        // 정리된 HTML 파일 저장
        fs.writeFileSync(outputFilePath, cleanedContent, 'utf8');
        
        console.log(`✅ 정리 완료! 저장된 파일: ${outputFilePath}`);
        console.log(`📊 원본 크기: ${(htmlContent.length / 1024).toFixed(2)} KB`);
        console.log(`📊 정리 후 크기: ${(cleanedContent.length / 1024).toFixed(2)} KB`);
        console.log(`📊 감소량: ${((htmlContent.length - cleanedContent.length) / 1024).toFixed(2)} KB`);
        
        return outputFilePath;
        
    } catch (error) {
        console.error('❌ 오류 발생:', error.message);
        throw error;
    }
}

/**
 * 디렉토리 내의 모든 HTML 파일을 정리하는 함수
 * @param {string} directoryPath - 디렉토리 경로
 */
function cleanAllHtmlFiles(directoryPath = '.') {
    try {
        const files = fs.readdirSync(directoryPath);
        const htmlFiles = files.filter(file => file.toLowerCase().endsWith('.html'));
        
        if (htmlFiles.length === 0) {
            console.log('📂 HTML 파일을 찾을 수 없습니다.');
            return;
        }
        
        console.log(`📂 ${htmlFiles.length}개의 HTML 파일을 찾았습니다.`);
        
        htmlFiles.forEach((file, index) => {
            console.log(`\n🔄 [${index + 1}/${htmlFiles.length}] 처리 중: ${file}`);
            const inputPath = path.join(directoryPath, file);
            cleanHtmlFile(inputPath);
        });
        
        console.log('\n🎉 모든 HTML 파일 정리가 완료되었습니다!');
        
    } catch (error) {
        console.error('❌ 디렉토리 처리 중 오류 발생:', error.message);
        throw error;
    }
}

// CLI에서 직접 실행할 때
if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.log('🧹 HTML 파일 정리 도구');
        console.log('');
        console.log('사용법:');
        console.log('  node html-cleaner.js <파일경로>              # 단일 파일 정리');
        console.log('  node html-cleaner.js <입력파일> <출력파일>    # 단일 파일 정리 (출력 경로 지정)');
        console.log('  node html-cleaner.js --all                  # 현재 디렉토리의 모든 HTML 파일 정리');
        console.log('  node html-cleaner.js --all <디렉토리>        # 지정 디렉토리의 모든 HTML 파일 정리');
        console.log('');
        console.log('예시:');
        console.log('  node html-cleaner.js index.html');
        console.log('  node html-cleaner.js input.html output.html');
        console.log('  node html-cleaner.js --all');
        console.log('  node html-cleaner.js --all ./downloads');
        process.exit(0);
    }
    
    if (args[0] === '--all') {
        const directory = args[1] || '.';
        cleanAllHtmlFiles(directory);
    } else if (args.length === 1) {
        cleanHtmlFile(args[0]);
    } else if (args.length === 2) {
        cleanHtmlFile(args[0], args[1]);
    } else {
        console.error('❌ 잘못된 인수입니다. --help로 사용법을 확인하세요.');
        process.exit(1);
    }
}

module.exports = {
    cleanHtmlContent,
    cleanHtmlFile,
    cleanAllHtmlFiles
}; 