$(function() {
	// $('form').submit(function(ev) {
	// 	ev.preventDefault();
	// 	var form = $(this);
	// 	// console.log(form.attr('action'), form.serialize());
	// 	$.ajax({
	// 		url: form.attr('action'),
	// 		type: form.attr('method'),
	// 		data: form.serialize(),
	// 		success: function(obj) {
	// 			console.log(obj);
	// 		}
	// 	});
	// });

	$('#autoColor').click(function() {
		var checked = $(this).attr('checked');
		$('#lineColor').attr('disabled', checked === 'checked');
	});
});
