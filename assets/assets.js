
$(() => {

    $("#refresh_button").on("click", handleData);

    function handleData() {
        $.get('/jsonString', function (data) {
            $("#download_section").empty();
            $("#down-select").empty();
            $("#down-select").append(`<option value="default">Please Select Your File</option>`);
            for (let i = 0; i < data.length; i++) {
                let j = i + 1;
                $("#download_section").append(`${j}: ${data[i]} </br>`);
                $("#down-select").append(`<option value="${data[i]}">${data[i]}</option>`);
            }
        })
    }

    $("#download_button").on("click", downloadData);

    function downloadData() {
        let selected = $(`#down-select option:selected`).val();
        $.get(`/uploaded/${selected}`).then((data) => {
            var link = document.createElement("a");
            link.setAttribute('download', '');
            link.href = `${selected}`;
            document.body.appendChild(link);
            link.click();
            link.remove();
        })
    }

});




