const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

module.exports = `<script>
    alert("Redirecting you...")
    setTimeout(()=>{
    window.location.href = "${url}"}, 3000)
</script>`;
