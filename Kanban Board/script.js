// SYNTECXHUB - Project 2 Kanban Board
let tasks = JSON.parse(localStorage.getItem('kanban-tasks') || 'null') || [
  {id:'1', text:'Design Kanban layout', col:'todo', time:'Today'},
  {id:'2', text:'Implement drag and drop API', col:'doing', time:'Today'},
  {id:'3', text:'Add localStorage support', col:'done', time:'Yesterday'}
];
let currentCol = 'todo';
let draggedId = null;

const save = () => localStorage.setItem('kanban-tasks', JSON.stringify(tasks));
const genId = () => Date.now().toString(36)+Math.random().toString(36).slice(2,5);
const escapeHtml = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

function render(){
  document.querySelectorAll('.task-list').forEach(l=>l.innerHTML='');
  tasks.forEach(t=>{
    const el = document.createElement('div');
    el.className='task';
    el.draggable=true;
    el.dataset.id=t.id;
    el.dataset.col=t.col;
    el.innerHTML = `<div class="task-text" contenteditable="true" onblur="editTask('${t.id}', this.innerText)">${escapeHtml(t.text)}</div>
      <div class="task-footer"><span class="task-time">${t.time}</span><button class="delete-btn" onclick="removeTask('${t.id}')">✕</button></div>`;
    el.addEventListener('dragstart', e=>{ draggedId=t.id; el.classList.add('dragging'); e.dataTransfer.effectAllowed='move'; });
    el.addEventListener('dragend', ()=>{ el.classList.remove('dragging'); draggedId=null; });
    document.querySelector(`[data-list="${t.col}"]`).appendChild(el);
  });
  ['todo','doing','done'].forEach(c=>{
    document.getElementById(`count-${c}`).textContent = tasks.filter(t=>t.col===c).length;
  });
  save();
}

function openModal(col){ currentCol=col; document.getElementById('modalTitle').textContent=`Add to ${col.toUpperCase()}`; document.getElementById('modal').classList.add('open'); document.getElementById('taskInput').value=''; setTimeout(()=>document.getElementById('taskInput').focus(),50); }
function closeModal(){ document.getElementById('modal').classList.remove('open'); }
function confirmAdd(){
  const v = document.getElementById('taskInput').value.trim();
  if(!v) return;
  tasks.unshift({id:genId(), text:v, col:currentCol, time:new Date().toLocaleDateString('en-GB',{day:'2-digit',month:'short'})});
  closeModal(); render();
}
function removeTask(id){ tasks = tasks.filter(t=>t.id!==id); render(); }
function editTask(id, txt){ const t=tasks.find(x=>x.id===id); if(t && txt.trim()){ t.text=txt.trim(); save(); } }
function clearBoard(){ if(confirm('Clear all tasks?')){ tasks=[]; render(); } }

document.querySelectorAll('.column').forEach(col=>{
  col.addEventListener('dragover', e=>{ e.preventDefault(); col.classList.add('drag-over'); });
  col.addEventListener('dragleave', ()=> col.classList.remove('drag-over'));
  col.addEventListener('drop', e=>{
    e.preventDefault(); col.classList.remove('drag-over');
    if(draggedId){ const task=tasks.find(t=>t.id===draggedId); if(task){ task.col=col.dataset.col; render(); } }
  });
});

document.getElementById('modal').addEventListener('click', e=>{ if(e.target.id==='modal') closeModal(); });
document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeModal(); });

render();