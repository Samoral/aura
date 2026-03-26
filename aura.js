$(".screens,.settings,.history,.flashcard_section,.notepad_section").hide();
alert();
 
localStorage.clear()
 var storage = JSON.parse(localStorage.getItem("storage")) || {sublec:[],sublec_jsonM:[],note_scroll:[],notepad:[],numberCounter:0};
 
 
    $(document).ready(()=>{
  console.log(storage)
  
/*if(storage.numberCounter>=29) {
  $("#stripe").text("no")
}*/


$.each(storage.notepad,(i,v)=>{
     $(".notepad_subSection").append(`  <br>
    <div style="background:black;color:#abbeda;padding:10px;border-radius:10px;height:auto;padding:10px">
    <b style="color:#6366f1;font-weight:bolder">${v.title}</b>
    <br/>
      ${v.content}
    </div>`);
})    

$.each(storage.sublec,(i,v)=>{
    $(".subLec").eq(v).removeClass("disabled").addClass("csr_pointer");
    $(".subLec").eq(v).html(`<div class="lessons dark_transparent" id="lesson_${v+1}">
        <div style="width: 50px;height: 30px;padding: 5px;border-radius: 8px;background: #e1e1ef;color: blue;display:flex;justify-content:  center;align-items: center;"><i class="fa fa-book" style="font-weight: 500px;"></i></div>
        
        <div style="width: 100%;">
        <small style="color: grey;font-size: 11px; font-weight: bolder;font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">LESSON ${v+1} <i class="fa fa-check-circle finished_course" style="color:green;"></i></small>
        <span class="page_counter" style="opacity:0;">${v+1}</span>
        <div style="display: flex;justify-content: space-between;margin-top: 5px; font-weight:bold;font: 13px;font-family: 'inter', sans-serif;width: 100%;" class="data_x2d2"> ${storage.sublec_jsonM[v-1]} <span style="color: white;background: rgb(84, 110, 214);font-size: 12px; padding: 3px 10px;border-radius: 20px;margin-right: 0;height:15px">Start</span></div>
        </div>
        
      </div>
      `)
    
})

function uI() {
   $(".dark_deep").css({"background":"#120822","color":"white"});
      $(".dark_deep").find("unactive").css("color","grey")
      $(".ark").css({"background":"#0a0514","color":"white"});
      $(".dark_white").css({"background":"black", "border": "1px solid rgb(105, 12, 198)","padding": "25px 10px 25px", "backdrop-filter":"blur(5px)", "border": "1px solid rgba(99, 102, 241, 0.3)", "box-shadow": "0 0 20px rgba(131, 9, 175,0.15),  inset 0 0 10px rgba(131, 9, 175,0.1);"})
      $(".dark_transparent").css("background","transparent");
      $(".lessons,.dark_list_or_important").css("background","#16122a")
      $(".dark_transparent .data_x2d2, .dark_transparent .title").css("color","#a8dcf6");
      $(".dark_progress").css("background","#a855f7");
      $(".dark_quiz").css({"background-color": "#16122a", "border-radius": "24px", "border": "0.3px solid rgba(205,125,255,0.5)"})
      $(".mainPage,.dark").css({"background":"#0f0b1e","color":"#abbeda"});
      $(".dark_header").css("color","#6366f1");
      $(".dark_highlight").css("background","#676bbc");

      $(".lessons, .dark_list_or_important").hover(function() {
        $(this).css("background","#1b1636");
      }, 
      
      function(){
        $(this).css("background","#16122a")
      }
    )
}

var arrow_leftFnc = function (){
$(".lectureNote").hide();
    $(".mainPage").show()
 }

$("#upload").change(async function() {

  const file = $(this)[0].files[0];
  if (!file) return;

  const formdata = new FormData();
  formdata.append("file", file);

  try {

    $(".dummy_contentSection")
      .html('<div class="loader"></div> Analyzing...')
      .show();

    const response = await fetch('https://aura-server-gb0e.onrender.com/generate', {
      method: "POST",
      body: formdata,
    });

    if (!response.ok) throw new Error("Server upload failed.");

    const data = await response.json();

    if (!data || !data.analysis) {
      throw new Error("Server returned an empty analysis.");
    }

    // Clean JSON string
    const cleanJsonString = data.analysis
      .replace(/```json\s*|```/g, "").trim();

    // Safe parse with array unwrapping
    let lectureData;
    try {
      lectureData = JSON.parse(cleanJsonString);

      // If backend returns an array with one object, unwrap it
      if (Array.isArray(lectureData) && lectureData.length === 1 && lectureData[0].lecture_topic) {
        lectureData = lectureData[0];
      }

      console.log("Parsed lectureData:", lectureData);
      
     console.log(lectureData.fileJson[0].lecture_topic[0].notes[0].important);
      
      // DEBUG
    } catch (err) {
      throw new Error("Failed to parse JSON: " + err.message);
    }

    // Check structure
    if (!lectureData) {
      throw new Error("Invalid structure: lecture_topic missing.");
    }

    // Render
    renderLecture(lectureData);

  } catch (err) {
    console.error(err);
    $(".dummy_contentSection")
      .html('<span style="color:red">Error: ' + err.message + '</span>');
  }

});

$(".sendLink").click(async function() {
  
  let vals = $("#upload_url").val();
  
try {

    $(".dummy_contentSection")
      .html('<div class="loader"></div> Analyzing...')
      .show();

const response = await fetch('http://localhost:3000/urlGenerate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ videoUrl: vals })
                });

    if (!response.ok) throw new Error("Server upload failed.");

    const data = await response.json();

    if (!data || !data.analysis) {
      throw new Error("Server returned an empty analysis.");
    }

    // Clean JSON string
    const cleanJsonString = data.analysis
      .replace(/```json\s*|```/g, "")
      .trim();

    // Safe parse with array unwrapping
    let lectureData;
    try {
      lectureData = JSON.parse(cleanJsonString);

      // If backend returns an array with one object, unwrap it
      if (Array.isArray(lectureData) && lectureData.length === 1 && lectureData[0].lecture_topic) {
        lectureData = lectureData[0];
      }

      console.log("Parsed lectureData:", lectureData);
      
     console.log(lectureData.fileJson[0].lecture_topic[0].notes[0].important);
      
      // DEBUG
    } catch (err) {
      throw new Error("Failed to parse JSON: " + err.message);
    }

    // Check structure
    if (!lectureData) {
      throw new Error("Invalid structure: lecture_topic missing.");
    }

    // Render
    renderLecture(lectureData);

  } catch (err) {
    console.error(err);
    $(".dummy_contentSection")
      .html('<span style="color:red">Error: ' + err.message + '</span>');
  }  
  
  
})

// --------------------------
// RENDER FUNCTION
// --------------------------
function renderLecture(lectureData) {

  const $container = $(".dummy_contentSection");
  $container.empty();




console.log(lectureData);
// ---------------------------------------Creating the DOM  
var wrapper = $(`  <div class="content content_section" id="signal_content">`)
let indexCounter = 4;
var containe = $(`<div style="display: flex;align-items: center;gap: 10px;font-size: 13px; margin:10px;bacground:red;width:100vw"><div style="border-radius: 20px;width: 8px;height: 16px; background: #2563eb;box-shadow:0px 0px 10px #6366f1"></div> <b style="font-family: 'inter', sans-serif;">Course Title: Signals and Systems</b></div>`); 
  
 wrapper.append(containe) 
  
$(".dummy_contentSection").append(wrapper)


  $.each(lectureData.fileJson, function(fileIndex, file) {
    console.log("File #" + fileIndex);


//creating lecture_wrapper
var lecture_wrapper = $(`    <div class="lecture_wrapper dark_white" >`);

//lecture Number
var lecture_number = $(`    <div class="lec dark_transparent" id="lec_1">
<span class="icon fa fa-play"></span> <span class="title"> Lecture 00${fileIndex+1} <br> <span style="font-size: 12px;color: grey;">Introduction</span></span> <i class="fa fa-angle-up" >
</i>
</div>`);

lecture_wrapper.append(lecture_number)

wrapper.append(lecture_wrapper)

console.log("fileJson"+file)
    // Loop through lecture_topic inside each file
    $.each(file.lecture_topic, function(topicIndex, topic) {
        console.log("  Topic: " + topic.topic);
  
  //creating sublec
  
 
let sublec = $(`    <div class="subLec disabled processedSublec" dummyClassName="processedLectureNote">
      
      <div class="lessons dark_transparent" id="lesson_1">
        <div style="width: 50px;height: 30px;padding: 5px;border-radius: 8px;background: #e1e1ef;color: blue;display:flex;justify-content:  center;align-items: center;"><i class="fa fa-book" style="font-weight: 500px;"></i></div>
        
        <div style="width: 100%;">
        <small style="color: grey;font-size: 11px; font-weight: bolder;font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">LESSON ${topicIndex+1} <i class="fa fa-check-circle finished_course" style="color:green;display:none"></i></small>
        <span class="page_counter" style="opacity:0;"></span>
        <div style="display: flex;justify-content: space-between;margin-top: 5px; font-weight:bold;font: 13px;font-family: 'inter', sans-serif;width: 100%;flex:1" class="data_x2d2">${topic.topic}</div><span style="color: white;background: rgb(84, 110, 214);font-size: 12px; padding: 3px 10px;border-radius: 20px;margin-right: 0;margin-top:10px;height:15px;">Start</span></div>
        </div>
        
      </div>
      
    </div>`);
    lecture_wrapper.append(sublec);
    indexCounter++;

    sublec.on("click",function(){

    $(".mainPage").hide()
   lectureNote.show().css("display","flex");
   
   $(".notes_paragraph").css({"animation-play-state":"running"})
   
 })

sublec.eq(0).removeClass("disabled").addClass("active")
//create lectureNote note container, where all notes under a sublev would be wrapped
let lectureNote = $(`<section class="lectureNote processedLectureNote dark">`);

let note_back = $(`<div class="back_button backButton_bigScreen note_nav csr_pointer" data-lucide="chevron-left" >
  
</div>

    
    `)
let noteFooter = $(`
 <div class="writeNote_icon" style="padding:10px;border-radius:50%;background:#1a1a1a;display:flex;justify-content:center;align-items:center;width:30px;height:30px;position:absolute;bottom:70px;right:10px;">
   <div ><i class="fa fa-pencil"></i></div>
 </div>  
    <div class="noteFooter">
      
      <div style="padding:10px;width:250px;border-radius:8px;text-align:center;background:#1a1a1a;margin:10px;opacity:0.7;color:white" class="back_button prev_button" ><span style="opacity:1;font-weight:bolder;font-family:'Times New Roman'">Back</span></div>
      
      <div style="padding:10px;width:250px;border-radius:8px;text-align:center;background:#9333ea;margin:10px;opacity:0.7;color:white" class="contin" ><span style="opacity:1;font-weight:bolder;font-family:'Times New Roman'">Continue</span></div>
      
      <div style="padding:10px;width: 250px;;border-radius:8px;text-align:center;background:green;margin:10px;opacity:0.7;color:white;display:none" class="nextQuiz" location="called_subQuiz1" ><span style="opacity:1;font-weight:bolder;font-family:'Times New Roman'">Next</span></div>     
      
      <div class="quiz_end_remark" style="display:none">
        
        <div style="color:green;text-align:center"><b> Correct </b></div>
        
        <div style="padding:10px;width:80%;border-radius:8px;text-align:center;background:rgba(0,0.1,0.2,0.3);margin:10px;opacity:0.7;color:white;width:250px" class="contin" ><span style="opacity:1;font-weight:bolder;font-family:'Times New Roman'">Continue</span></div>
        
       
     
  
        
        
      </div>
      
      
    </div>`);

let lectureNote_smallScreen = $(`<div class="signal-header smallScreen screens" style="magin:5px">
     
        <div style="display:flex;justify-content:space-between;marin:0;padding:5px 10px;align-items:center;gap:5px">
      
      <div style="font-weight:50;width:20px;height:20px;padding:10px;border-radius:50%;background:rgba(255,255,255,0.03);display:flex;justify-content:center;align-items:center" class="fa fa-arrow-left"> </div>
      
<div style="display:flex;gap:20px">
              <div id="heart" style="background: rgba(255, 0, 0, 0.09);border: 0.5px solid rgba(255, 0, 0, 0.05);display:flex;align-items:center;gap:5px"> <i data-lucide="heart"  ></i> <b style="color: red;font-weight: bolder;"> 5</b></div>
              
              <div style="display:flex;align-items:center;gap:5px;">
                <i data-lucide="message-circle-more"></i>
                5
              </div>
              </div>
              
              
</div>

    
        <div class="progress learningProgress dark" style="margin-bottom:0">
      <div ><span class="dark_progress" style="backgound:blue;opacity:0.8;display:block;margin:0;height:8px;width:0px;border-radius:1rem;display:flex;align-items:center;justify-content:space-between;padding-right:5px"></span></div>
      </div>
 </div>`)
    
    
let lectureNote_wideScreen = $(`<div class="signal-header wideScreen screens" style="display:flex;justify-content:space-between;margin:0;padding:0 10px;align-items: center;font-size: 14px;">
      
      <div class="fa fa-arrow-left csr_pointer" data-lucide="arrow-left"> </div>
      <div class="progress learningProgress dark" style="margin-bottom:0">
        <div  ><span class="dark_progress" style="background: blue;opacity:0.8;display:block;margin:0;height:100%;width:0px;border-radius:1rem;display:flex;align-items:center;justify-content:space-between;padding-right:5px"></span></div>
        </div>
        <div class="heart" style="color: rgb(255, 183, 0); font-size: 14px;"> <i data-lucide="message-circle-more"></i> <h2 style="">5</h2></div>
    </div>`);
    
    lectureNote.append(lectureNote_smallScreen,lectureNote_wideScreen);
    
    lectureNote_smallScreen.hide();
    lectureNote_wideScreen.hide();
  
  // show required screen size.. 
   if($(document).width() <=600) {

   lectureNote_smallScreen.show();
  
 }
 
 else {
   lectureNote_wideScreen.show();
 }  
    
 //create signalNote, the sub container   
let signalNote = $(`<div class="signalNote">`);

lectureNote.append(signalNote,note_back,noteFooter);

signalNote.on("scroll",function(e) {
    e.preventDefault();
    e.stopPropagation();
  let value = ($(this).scrollLeft() / ($(this)[0].scrollWidth-mainPage_width))*$(this).parent().children(".signal-header").children(".learningProgress").children("div").width()
  
  console.log($(this)[0].scrollWidth)
  
  
    $(this).parent().children(".signal-header").children(".learningProgress").children("div").children("span").css("width",value+"px")
    

    
  
    
   
    
    
  })

var processedContinue_click_func = function() {
  value = signalNote.scrollLeft() + mainPage_width;
 
  console.log(value)
  

  if(value >= signalNote[0].scrollWidth - mainPage_width) {

    $(this).parent().parent().siblings(".mainPage").children(".content").children(".lecture_wrapper").children(".subLec").eq(index+1).removeClass("disabled").addClass("csr_pointer");

    
    noteFooter.find(".contin").text("Continue");
    
    $(".lessons,.dark_list_or_important").css("background","#16122a")
      $(".dark_transparent .data_x2d2, .dark_transparent .title").css("color","#a8dcf6");
      $(".dark_progress").css("background","#a855f7"); 
  }
  
  //show finish course on the last Page
  if(value >= signalNote[0].scrollWidth - (mainPage_width*2) ) {
    
    noteFooter.find(".contin").text("Finish Course"); 
    sublec.find(".finished_course").show();
  }
  
  
  if (value >= signalNote[0].scrollWidth - lectureNote.find(".learningProgress").children("div").width()) {
     
    noteFooter.find(".contin").text("Continue");
    
    value=0;
   
   setTimeout(()=>{
    lectureNote.hide();
    $(".mainPage").show();
   },1)
  }
  signalNote.scrollLeft(value)
  noteFooter.find(".contin").eq(index).show()
  
  
  


  
  notes_counter++;

   reading_percentage.text( `${Math.floor((notes_counter/notes_length)*100)}%`);
   
   if(`${Math.floor((notes_counter/notes_length)*100)}` >= 50) {
     reading_percentage.css("border","3px solid #f2aaaa")
   }
   
  if(`${Math.floor((notes_counter/notes_length)*100)}` >= 60) {
     reading_percentage.css("border","3px solid green")
   }
   
   if(`${Math.floor((notes_counter/notes_length)*100)}` >= 80) {
     reading_percentage.css({"border":"3px solid #94a3b8","color":"yellowgreen"})
   }
   
}

noteFooter.find(".contin").click(processedContinue_click_func)

var back_click_func = function() {
  value = $(".signalNote").eq(index).scrollLeft() - mainPage_width;
 
  console.log(value)
  
  let page_counter = $(".page_counter").eq(index).text();
  page_counter++;
  
  console.log(page_counter)
  if(value >= $(".signalNote").eq(index)[0].scrollWidth - mainPage_width) {

    $(this).parent().parent().siblings(".mainPage").children(".content").children(".lecture_wrapper").children(".subLec").eq(index+1).removeClass("disabled").addClass("csr_pointer");
    $(this).parent().parent().siblings(".mainPage").children(".content").children(".lecture_wrapper").children(".subLec").eq(index+1).html(`<div class="lessons dark_transparent" id="lesson_${index+1}">
        <div style="width: 50px;height: 30px;padding: 5px;border-radius: 8px;background: #e1e1ef;color: blue;display:flex;justify-content:  center;align-items: center;"><i class="fa fa-book" style="font-weight: 500px;"></i></div>
        
        <div style="width: 100%;">
        <small style="color: grey;font-size: 11px; font-weight: bolder;font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">LESSON ${index+1} <i class="fa fa-check-circle" style="color:green;display:none"></i></small>
        <span class="page_counter" style="opacity:0;">${index+1}</span>
        <div style="display: flex;justify-content: space-between;margin-top: 5px; font-weight:bold;font: 13px;font-family: 'inter', sans-serif;width: 100%;" class="data_x2d2"> <span>${sublec_json[index]} </span> <span style="color: white;background: blue;font-size: 12px; padding: 3px 10px;border-radius: 20px;margin-right: 0;height:15px;">Start</span></div>
        </div>
        
      </div>
      `)
    
    $(".contin").text("Continue"); 
  }
  
  //show finish course on the last Page
  if(value >= $(".signalNote").eq(index)[0].scrollWidth - (mainPage_width*2) ) {
    
    $(".contin").text("Finish Course"); 
    page_counter=1;
  }
  
  $(".page_counter").eq(index).text(page_counter);
  
  
  if (value >= $(".signalNote").eq(index)[0].scrollWidth - $(".learningProgress").children("div").width()) {
     
    $(".contin").text("Continue");
    
    value=0;
   
   setTimeout(()=>{
    $(".lectureNote").eq(index).hide();
    $(".mainPage").show()
   },1)
  }
  $(".signalNote").eq(index).scrollLeft(value)
  $(".contin").eq(index).show()
  
  
  

}



//append to wrapper
$(".wrapper").append(lectureNote)


        // Loop through notes
  $.each(topic.notes, function(noteIndex, note) {
   
        console.log(" important: " + note.important);  
            console.log("    Note intro: " + note.intro);
 
 //create note
let notes = $(`<div class="notes note_1" style="width: 100%;margin: 20px auto;margin-left: 40px;flex-grow: 1;">`);

//create notes_paragraph, a sub container where all texts are
let notes_paragraph = $(`         <div class="notes_paragraph notes_heading" style="magin: auto 40px; display: flex;flex-direction: column;gap: 10px;padding:5px;colr:black;">`);

notes.append(notes_paragraph);

//append to container
signalNote.append(notes)

/* CONDITION TO CHECK IF IT IS NORMAL PARAGRAPH OR IMPORTANT AND APPEND APPROPRIATELY */

/* 1. */
if(note.theme) {
  notes_paragraph.append(`<h1 style="font-family: 'inter', sans-serif;margin:10px;color:#6366f1;">${note.theme}</h1>`);
}

/* 2 */
if(note.intro) {
  notes_paragraph.append(`<p>${note.intro}</p>`);
}

/* 3. */
if(note.important) {
  notes_paragraph.append(`          <div class="dark_list_or_important" style="backgrund: #16122a;padding: 14px;border-radius: 16px;mrgin: 30px 32px;border: 1px solid rgba(255, 255, 255, 0.05);">
            <p style="font-weight: 300;color: #abbeda;">${note.important}</p>
          </div>`);
}

/* 4. */
if(note.example) {
  let example_container = $(`          <div style="display: flex;gap: 10px;">
                <div style="width: 6px;height: 24px;background:#f32553;border-radius: 4px;box-shaow: 0px 0px 10px rgba(223,123,283);"></div>
                <span style="color: #f32553;font-family: 'inter' sans-serif">FOR EXAMPLE</span>
          </div>`);
  let example_paragraph = $(`<div>`);         
    notes_paragraph.append(example_container,example_paragraph);
    
        $.each(note.example,function(index,examples) {
          let examples_N = $(`<p style="display: flex; gap: 10px;  margin-bottom: 16px;padding: 16px;border-radius: 12px;border: 1px solid #abbeda; background: rgba(255, 255, 255, 0.02);" >
  <i class="fa fa-check-circle" style="color: rgb(57, 145, 63);"> </i> <span> ${examples} </span>
</p>`);


example_paragraph.append(examples_N);
})


}

/* 5. */
if(note.svg_diagram) {
  notes_paragraph.append(note.svg_diagram)
}

if(note.paragraph) {
  notes_paragraph.append(`<p>${note.paragraph}</p>`)
}

/* 6. */
if(note.conclusion) {
  notes_paragraph.append(`<p>${note.conclusion}</p>`)
}


            console.log("    Note conclusion: " + note.conclusion);
        });

        // Access quiz questions
        if(topic.quiz && topic.quiz.questions) {
            $.each(topic.quiz.questions, function(qIndex, question) {
                console.log("    Quiz Question: " + question.question);
                console.log("    Answer: " + question.answer);
            });
        }

        // Access notes_N
        $.each(topic.notes_N, function(nIndex, notesN) {
            console.log("    notes_N: " + JSON.stringify(notesN));
        });

        // Access flashcards
        $.each(topic.flashcards, function(fIndex, flashcard) {
            console.log("    Flashcard: " + flashcard.summary);
        });
    });
    
   uI() 
  
  
 
 
    
});


 renderMathInElement(document.body) 
  lucide.createIcons();
  
}


let time =10000;
let flashcardIndex =0;
//update flashcard counter
$(".flashcardCounter").text(`${flashcardIndex+1}/${$(".dummyFlashCard").length}`)

let numberCounting = storage.numberCounter;


    let correct_counter = 0;
    let index;
    let subQuiz_location;
    let upArrow = $(".lecture_wrapper").find(".lec");
    let upArrow_answered = true;
    let sublec_json = ["More On Signals", "Classes Of Signals","Odd Signals","Other Classes Of Signals"];
    let lightState = "light";
    

//flashcard script
$(".next_flashCard").click(function() {
  flashcardIndex++;
  if(flashcardIndex > $(".dummyFlashCard").length-1) {
  flashcardIndex=$(".dummyFlashCard").length-1;
  }
  
  $(".dummyFlashCard").hide().eq(flashcardIndex).show();
  $(".flashcardCounter").text(`${flashcardIndex+1}/${$(".dummyFlashCard").length}`)
  
  
})
  
$(".back_flashCard").click(function() {
  flashcardIndex--;
  if(flashcardIndex < 0) {
  flashcardIndex=0;
  }
  $(".dummyFlashCard").hide().eq(flashcardIndex).show();
  $(".flashcardCounter").text(`${flashcardIndex+1}/${$(".dummyFlashCard").length}`)
  
  
})  
      
let canvas;
let notes_counter =0;
let notes_length = $(".notes").length;
let reading_percentage = $(".reading_percentage");
      let popup = $(".popup");
      
      
  //load based on width
  if($(document).width() <=600) {
    canvas = document.querySelector('.aiIcon_2');
    
   $(".smallScreen").show();
   
   $("#navBar,.seeknal_navBar").click( function() {
    
     $(".seeknal_navBar_cont").show()
     
    })
    
    $(".seeknal_navBar_cont").click( function() {
      $(this).hide()
    })
   
 }
 
 else {
   $(".wideScreen").show();
  canvas = document.querySelector('.aiIcon');
 }  
  
  $(".mainPage").show()
      
      function reduceLife() {
                  $(".user_life").html($(".user_life").html()-1);  

            if($(".user_life").html()<=0) {
              popup.show();
              $(".nextQuiz").addClass("disabled");
            }
      }

 var collapsibleFnc = function() {
        $(this).children(".collapsible").slideToggle(300)
        
      }

$(".collapsible_caller").click(collapsibleFnc)

$(".settingsBtn,.settingsBack").click(function(){
  $(".pages:visible").toggle();
  $(".settings").toggle();
})

$(".historyBtn,.historyBack").click(function() {
  $(".pages:visible").toggle();
  $(".history").toggle()
})

$(".flashcardBtn,.flashcard_back").click(function() {
  $(".pages:visible").toggle();
  $(".flashcard_section").toggle();
})

$(".notepadBtn,.notepad_back").click(function() {
  $(".pages:visible").toggle();
  $(".notepad_section").toggle();
})



      $("textarea").val("")

uI();

  $(".toggle_light").click(()=>{

    if(lightState == "light") {

    $(".dark_deep").css({"background":"#fff","color":"black"});
      $(".dark").css({"background":"white","color":"black"});
      $(".dark_white").css({"background":"transparent","border":"0","box-shadow":"none"})
      $(".dark_transparent").css("background","#fff")
      $(".dark_transparent .data_x2d2").css("color","white");
      $(".mainPage").css({"background":"transparent","color":"black"})


      lightState="dark"

    }

    else {


      $(".dark_deep").css({"background":"rgb(22, 1, 30)","color":"white"});
      $(".dark").css({"background":"rgb(12, 1, 20)","color":"white"});
      $(".dark_white").css({"border": "1px solid rgb(105, 12, 198)","padding": "25px 10px 25px", "backdrop-filter":"blur(5px)", "border": "1px solid rgba(99, 102, 241, 0.3)", "box-shadow": "0 0 20px rgba(131, 9, 175,0.15),  inset 0 0 10px rgba(131, 9, 175,0.1)"})
      $(".dark_transparent").css("background","transparent")
      $(".dark_transparent .data_x2d2").css("color","white");
      $(".mainPage").css({"background":"rgb(16, 10, 29)","color":"white"})

      
      lightState="light"

    }

  })

upArrow.click(function(){
  
  if(upArrow_answered==true) {
  $(this).children("i").removeClass("fa-angle-up").addClass("fa-angle-down");
  upArrow_answered=false;
  }
  
  else {
      $(this).children("i").removeClass("fa-angle-down").addClass("fa-angle-up")
      upArrow_answered=true;
  }

  $(this).siblings().slideToggle(300)
})

          let page_width = $(document).width();
          let mainPage_width = $(".mainPage").width()

          

    $("#brandName").click(function(){
    
    if( $(".courseList").is(":hidden") ) {
      
    $("#brandName i").attr("class","fa fa-angle-up") 
     $(".coursesCont").slideDown()

    }  
    
   else {
     $("#brandName i").attr("class","fa fa-angle-down") 
     $(".coursesCont").slideUp()
   } 
    
    })
    
    $(".courses").click(function(){
      
      $(".content").hide();
      $(`#${$(this).attr("value")}`).show();
      $(".coursesCont").slideUp()
      $("#brandName i").attr("class","fa fa-angle-down") 
      
    })
    

    $(".adminSublec").on("click",function(){
    index = JSON.parse($(this).attr("index"))




if($(".lectureNote").eq(index).html()!==undefined) {
    $(".mainPage").hide()
   $(".lectureNote").eq(index).show().css("display","flex");
   
   $(".notes_paragraph").css({"animation-play-state":"running"})
}

else {
  alert("Upgrade your tier or come back tomorrow")
}
  
  $.each(storage.note_scroll,(i,v)=>{

  $(".signalNote").eq(i).scrollLeft(v)
  
})
  


   
 })
 
  $(".signalNote").on("scroll",function(e) {
    e.preventDefault();
    e.stopPropagation();
  let value = ($(this).scrollLeft() / ($(this)[0].scrollWidth-mainPage_width))*$(this).parent().children(".signal-header").children(".learningProgress").children("div").width()
  
  console.log($(this)[0].scrollWidth)
  
  
    $(this).parent().children(".signal-header").children(".learningProgress").children("div").children("span").css("width",value+"px")
    

    
  
    
   
    
    
  })
   
  
 
 $(document).on("click",".fa-arrow-left",arrow_leftFnc);
 
 
 
 
 setInterval(()=>{
   $(".quote").fadeToggle(1500)
 },time)
 
 $(".lectureNote").on("touchstart",function(e) {
 clientMsgX_down = e.touches[0].clientX;
 
 clientMsgY_down = e.touches[0].clientY
  
  
})

 $(".lectureNote").on("touchmove",function idFxn(e) {
   
  if(!clientMsgX_down || !clientMsgY_down) {
    return;
  }
   
 var clientMsgX_up = e.touches[0].clientX;
 
var clientMsgY_up = e.touches[0].clientY;

var xDiff = clientMsgX_down - clientMsgX_up;

var yDiff = clientMsgY_down- clientMsgY_up

if(Math.abs(xDiff) < Math.abs(yDiff)) {


  if (yDiff>0) {
    $(".quote").slideUp(500)
    time=0;
    time+=50000;
  }

else {
  $(".quote").slideDown(500)
  time=0;
    time+=50000;
}
}

   
 })

let value =0;

var continue_click_func = function() {
  
  if($("#stripe").text()=="yes") {
  value = $(".signalNote").eq(index).scrollLeft() + mainPage_width;

numberCounting++;
console.log("nc",numberCounting)

storage.numberCounter = numberCounting



storage.note_scroll[index]=value;

  console.log(value)
  
  let page_counter = $(".page_counter").eq(index).text();
  page_counter++;
  
  console.log(page_counter)
  if(value >= $(".signalNote").eq(index)[0].scrollWidth - mainPage_width) {

    $(".contin").parent().parent().siblings(".mainPage").children(".content").children(".lecture_wrapper").children(".subLec").eq(index+1).removeClass("disabled").addClass("csr_pointer");
    $(".contin").parent().parent().siblings(".mainPage").children(".content").children(".lecture_wrapper").children(".subLec").eq(index+1).html(`<div class="lessons dark_transparent" id="lesson_${index+1}">
        <div style="width: 50px;height: 30px;padding: 5px;border-radius: 8px;background: #e1e1ef;color: blue;display:flex;justify-content:  center;align-items: center;"><i class="fa fa-book" style="font-weight: 500px;"></i></div>
        
        <div style="width: 100%;">
        <small style="color: grey;font-size: 11px; font-weight: bolder;font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">LESSON ${index+1} <i class="fa fa-check-circle finished_course" style="color:green;display:none"></i></small>
        <span class="page_counter" style="opacity:0;">${index+1}</span>
        <div style="display: flex;justify-content: space-between;margin-top: 5px; font-weight:bold;font: 13px;font-family: 'inter', sans-serif;width: 100%;" class="data_x2d2"> ${sublec_json[index]} <span style="color: white;background: rgb(84, 110, 214);font-size: 12px; padding: 3px 10px;border-radius: 20px;margin-right: 0;height:15px">Start</span></div>
        </div>
        
      </div>
      `)
    
    $(".contin").text("Continue");
    
    $(".lessons,.dark_list_or_important").css("background","#16122a")
      $(".dark_transparent .data_x2d2, .dark_transparent .title").css("color","#a8dcf6");
      $(".dark_progress").css("background","#a855f7"); 
   
    
  storage.sublec[index] = index+1;
  storage.sublec_jsonM[index] = sublec_json[index];
   
   
 /*else {
   storage.sublec.push(index);
  storage.sublec_jsonM.push(sublec_json[index]);
 }*/
   
  localStorage.setItem("storage",JSON.stringify(storage));
    
  }
  
  //show finish course on the last Page
  if(value >= $(".signalNote").eq(index)[0].scrollWidth - (mainPage_width*2) ) {
    
    $(".contin").text("Finish Course"); 
    $(".finished_course").eq(index).show();
    page_counter=1;
  }
  
  $(".page_counter").eq(index).text(page_counter);
  
  
  if (value >= $(".signalNote").eq(index)[0].scrollWidth - $(".learningProgress").children("div").width()) {
     
    $(".contin").text("Continue");
    
    value=0;
   
    $(".lectureNote").eq(index).hide();
    $(".mainPage").show()
   
  }
  $(".signalNote").eq(index).scrollLeft(value)

  if($(document).width() <=600) {
  $(".contin").eq(index).show()
  }
  
  


  
  notes_counter++;

   reading_percentage.text( `${Math.floor((notes_counter/notes_length)*100)}%`);
   
   if(`${Math.floor((notes_counter/notes_length)*100)}` >= 50) {
     reading_percentage.css("border","3px solid #f2aaaa")
   }
   
  if(`${Math.floor((notes_counter/notes_length)*100)}` >= 60) {
     reading_percentage.css("border","3px solid green")
   }
   
   if(`${Math.floor((notes_counter/notes_length)*100)}` >= 80) {
     reading_percentage.css({"border":"3px solid #94a3b8","color":"yellowgreen"})
   }
   



localStorage.setItem("storage",JSON.stringify(storage));   
   
}

}

var back_click_func = function() {
  alert()
  value = $(".signalNote").eq(index).scrollLeft() - mainPage_width;
 numberCounting--;
  storage.note_scroll[index]=value;
  
  let page_counter = $(".page_counter").eq(index).text();
  page_counter++;
  
  console.log(page_counter)
  if(value >= $(".signalNote").eq(index)[0].scrollWidth - mainPage_width) {

    $(this).parent().parent().siblings(".mainPage").children(".content").children(".lecture_wrapper").children(".subLec").eq(index+1).removeClass("disabled").addClass("csr_pointer");
    $(this).parent().parent().siblings(".mainPage").children(".content").children(".lecture_wrapper").children(".subLec").eq(index+1).html(`<div class="lessons dark_transparent" id="lesson_${index+1}">
        <div style="width: 50px;height: 30px;padding: 5px;border-radius: 8px;background: #e1e1ef;color: blue;display:flex;justify-content:  center;align-items: center;"><i class="fa fa-book" style="font-weight: 500px;"></i></div>
        
        <div style="width: 100%;">
        <small style="color: grey;font-size: 11px; font-weight: bolder;font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">LESSON ${index+1} <i class="fa fa-check-circle" style="color:green;display:none"></i></small>
        <span class="page_counter" style="opacity:0;">${index+1}</span>
        <div style="display: flex;justify-content: space-between;margin-top: 5px; font-weight:bold;font: 13px;font-family: 'inter', sans-serif;width: 100%;" class="data_x2d2"> <span>${sublec_json[index]} </span> <span style="color: white;background: blue;font-size: 12px; padding: 3px 10px;border-radius: 20px;margin-right: 0;height:15px">Start</span></div>
        </div>
        
      </div>
      `)
    
    $(".contin").text("Continue"); 
  }
  
  //show finish course on the last Page
  if(value >= $(".signalNote").eq(index)[0].scrollWidth - (mainPage_width*2) ) {
    
    $(".contin").text("Finish Course"); 
    page_counter=1;
  }
  
  $(".page_counter").eq(index).text(page_counter);
  
  
  if (value >= $(".signalNote").eq(index)[0].scrollWidth - $(".learningProgress").children("div").width()) {
     
    $(".contin").text("Continue");
    
    value=0;
   
   setTimeout(()=>{
    $(".lectureNote").eq(index).hide();
    $(".mainPage").show()
   },1)
  }
  $(".signalNote").eq(index).scrollLeft(value)
  $(".contin").eq(index).show()
  
  
  


  
  localStorage.setItem("storage",JSON.stringify(storage))
}



$(".contin").on("click",continue_click_func);
$(document).on("click",".next_button",continue_click_func)
$(document).on("click",".prev_button",back_click_func)


$(".signalNote").on("scroll", function() {

if($(this).scrollTop() >= 10) {
    $(".contin").css({"background":"green","transition-duration":"0.5s","pointer-events":"auto"})
    
    $(".contin").on("click")
  }
  
  })
    
    
    
    
 
 let quizCounter = 0;
 
 
 $(".quizOption").click(function() {
  
  if($(this).attr("dummyVal")=="b") {
    $(this).toggleClass("correct")
    $(this).children(".quizSts").css("opacity","1")
    $(".quizProgress_circle i").eq(quizCounter).css("background","rgba(0,250,02,1)")
    
    subQuiz_location = $(this).parent().parent(".subQuiz,.dummy_subQuiz")
  }
  
  else {
    $(this).toggleClass("incorrect")
        $(this).children(".quizSts").css("opacity","1")
        $(this).siblings(".explanation").show()
        $(".quizProgress_circle i").eq(quizCounter).css("background","rgba(250,0,2,0.7)")
        $(this).parent().siblings().children('.b').toggleClass("correct")
        $(this).parent().children('.b').toggleClass("correct")
        $(this).parent().siblings().children(".b").children(".quizSts").css("opacity","1")
        $(this).parent().children(".b").children(".quizSts").css("opacity","1")
            subQuiz_location = $(this).parent().parent(".subQuiz,.dummy_subQuiz");

            // reduce the life (heart) by 1

reduceLife();
            





  
    
  
    
  }
  
  $(this).parent().siblings().children(".quizOption").css("pointer-events","none")
  
  $(this).parent().children(".quizOption").css("pointer-events","none")
  

  $(".nextQuiz").eq(index).show()
  
  $(".contin").eq(index).hide()
  
 })
 

let folding = ["d_sQ1","d_sQ2","d_sQ3","d_sQ4","d_sQ5","d_sQ6","d_sQ7","d_sQ8"];

 $(".nextQuiz").click(function() {
 

   
   subQuiz_location.html($(`.${folding[quizCounter]}`))
  
  console.log($(`.${folding[quizCounter]}`).html()) 

   //$(".quiz").scrollTop($(".quizCont")[0].scrollHeight)
   
   $(this).hide()
  quizCounter++; 
   
   $(".quizProgress").text((quizCounter+1)+"/5")
 }) 
 
 let $this;
 
        /*==========================Drag and Drop Quiz Answers========================*/
       
       let drag_drop_quiz_answer = {
         "1": [
           "Abstraction",
           "Measurable",
           "Function",
           "Independent"
         ]
       }
 
   
  $('.draggable_option').on('dragstart', function(e) {
      e.originalEvent.dataTransfer.setData('text', $(this).text());
      $this = $(this)
    });

    $('.dragged_toBox')
      .on('dragenter dragover', function(e) {
        e.preventDefault();
      })
      .on('drop', function(e) {
        e.preventDefault();
        const text = e.originalEvent.dataTransfer.getData('text');
        $(this).text(text);
        $this.css({"opacity":"0.5","pointer-events":"none"})
  
  
  
let a = $(this)

if(a.text()==drag_drop_quiz_answer["1"][a.index()]) {
  a.css("color","green");
  correct_counter++;

  if(correct_counter>=4) {
    $(".draggable_option_Clear,.motivation_container").toggle();

    $(".motivation_container").css('display','flex')
    
    
  }
  
 //==============================//Automatically Scroll To Next Page
//===============================//
     
     if(a.html() !== "----------" && a.siblings(".dragged_toBox").not(":contains('----------')").length === a.siblings(".dragged_toBox").length) {
       

       
     }
  
}

else {
  a.css("color","red")
  reduceLife();
}

     
      }) 
   
 
 
  $(".draggable_option_Clear").click(function() {
    
    $(this).parent().siblings().find(".dragged_toBox").html("----------").css("color","black");
    
    $(".draggable_option").css({"opacity":"1","pointer-events":"auto"})
    
  })    
  
  
  $(".motivation_contin").click(continue_click_func)
  
 
 

  


$("#cts_simulation").click(function() {
  
  $(".signal-packet").attr("cy","30").css("transition","cy 1.6s ease-in")
 
 setTimeout(()=>{

$(".signal-packet").attr("cx","287").css("transition","cx 1.6s ease-in")

},800)

setTimeout(()=>{

$(".signal-packet").attr("cy","70").css("transition","cy 1.6s ease-in")

},2400) 

setTimeout(()=>{
  $(".signal-packet").attr({"cx":"136","cy":"70"})
},5000)


  
})
 
$("#dts_simulation").click(()=>{

 
dts_packet_counter=0;


let dts_int = setInterval(()=>{
  
  $(".dts_packet").eq(dts_packet_counter).css("fill","#fbbf24").attr("r","5")
  

  if(dts_packet_counter>3) {
    
    dts_packet_counter=0;
    clearInterval(dts_int)
    $(".dts_packet").css("fill","black").attr("r","3")
  }

dts_packet_counter++;  

  
},500)


  }) 
  
    
    
     
    
    
 // comment script
 $(document).on("click",".comment_icon,.comment_container_back",function(e){
   
   
          e.preventDefault();
          e.stopPropagation();
          $(".comment_container").toggleClass("comment_container_active")
          

        })

 //notepad script
 $(document).on("click",".writeNote_icon",function(e){
   
   $(".noteCreator_container").show().css("display","flex");
 })
 
 $(".noteCreator_containerBack").click(()=>{
      $(".noteCreator_container").hide();
 })
 
 $(".saveNotepad").click(()=>{
   
   if($(".noteCreator_txtarea").val().trim()!=="") {
   $(".notepad_subSection").append(`  <br>
    <div style="background:black;color:#6366f1;padding:10px;border-radius:10px;height:auto;padding:10px">
    <b style="color:#abbeda;font-weight:bolder;">${$(".noteCreator_titleInput").val()}</b>
    <br/>
      ${$(".noteCreator_txtarea").val()}
    </div>`);
    
   storage.notepad.push({"title":$(".noteCreator_titleInput").val(),"content":$(".noteCreator_txtarea").val()});
   
   localStorage.setItem("storage",JSON.stringify(storage))
    
    $(".noteCreator_txtarea,.noteCreator_titleInput").val("");
    $(".noteCreator_container").hide()
   }
   
   
 })
 
 $(".home").click(()=>{
$(".mainPage").show();
$(".lectureNote").hide()

 })

$(".comment_send_btn").click(function(){
  $(".comment_chat_block").append(`<div class="user_comment">
                    <div class="user_commentPix">

                    </div>

                        <div class="user_commentTxt">
                            <b> ${$("#user_name").html()} <span style="color: grey;font-size: 12px;">12:09 AM</span></b>

                            ${$(this).siblings(".comment_txtarea").val()}
                        </div>

                </div>
`)

$(this).siblings(".comment_txtarea").val("")
$(this).parent().siblings(".comment_chat_block").scrollTop($(this).parent().siblings(".comment_chat_block")[0].scrollHeight)

})

 $(".upload_icon,.upload_back").click(function() {
  $(".upload_containerSmall_screen,.header").toggle()
  $(".upload_container input").focus();
  $(".content_section,.dummy_contentSection").toggle();
  $(".dummy_contentSection").toggleClass("flex")
 })




        const ctx = canvas.getContext('2d');
        const center = 12;
        let angle = 0;

        function draw() {
            ctx.clearRect(0, 0, 24, 24);
            
            // 1. Vibrant "Energy" Background (Enhanced for Dark Mode)
            ctx.save();
            ctx.translate(center, center);
            ctx.rotate(angle);
            
            // Horizontal Pulse
            ctx.beginPath();
            ctx.ellipse(0, 0, 11, 4, 0, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 0, 225, 0.8)'; 
            ctx.fill();

            // Vertical Pulse
            ctx.beginPath();
            ctx.ellipse(0, 0, 11, 4, Math.PI / 2, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(168, 85, 247, 0.5'; 
            ctx.fill();
            ctx.restore();

            // 2. The Power Bolt (High Contrast Electric Gradient)
            ctx.beginPath();
            ctx.moveTo(14, 3);   
            ctx.lineTo(7, 12);   
            ctx.lineTo(11, 12);  
            ctx.lineTo(10, 21);  
            ctx.lineTo(17, 10);  
            ctx.lineTo(13, 10);  
            ctx.closePath();

            const boltGrad = ctx.createLinearGradient(12, 3, 12, 21);
            boltGrad.addColorStop(0, '#a5b4fc'); // Electric blue-white
            boltGrad.addColorStop(0.5, '#6366f1'); // Deep indigo
            boltGrad.addColorStop(1, '#a855f7'); // Electric purple

            // Stronger Neon Shadow for dark background
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#6366f1';
            
            ctx.fillStyle = boltGrad;
            ctx.fill();

            // Crisp highlight stroke
            ctx.shadowBlur = 0;
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Slower, smoother rotation for high-end feel
            angle += 0.015;
            requestAnimationFrame(draw);
        }

        draw();

        

        // Toggle Functionality
        function toggleLecture(id) {
            const content = document.getElementById(id);
            const icon = document.getElementById('icon-' + id);
            
            if (content.style.display === 'none' || content.classList.contains('hidden-state')) {
                content.style.display = 'flex';
                content.classList.remove('hidden-state');
                icon.style.transform = 'rotate(180deg)';
            } else {
                content.style.display = 'none';
                content.classList.add('hidden-state');
                icon.style.transform = 'rotate(0deg)';
            }
        }
$(".overlay").hide()
      
      lucide.createIcons();
      
    })
