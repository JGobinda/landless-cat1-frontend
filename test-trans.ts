import Sanscript from 'sanscript';

const testRoundRobin = (input) => {
    console.log(`\nTyping: ${input}`);
    let currentField = "";
    for (let char of input) {
        let tempValue = currentField + char;
        console.log(`  Added '${char}', raw value in field: ${tempValue}`);
        
        // 1. Back-transliterate the whole field to Roman (itrans)
        let romanized = Sanscript.t(tempValue, 'devanagari', 'itrans');
        console.log(`    Detected Romanized: ${romanized}`);
        
        // 2. Forward-transliterate back to Devanagari
        currentField = Sanscript.t(romanized, 'itrans', 'devanagari');
        console.log(`    Final Field: ${currentField}`);
    }
};

testRoundRobin("nepal");
testRoundRobin("kathmandu");
