import { useEffect, useRef } from "react";

export default function PdfViewerComponent(props) {
const containerRef = useRef(null);
let instanceRef = useRef(null);

useEffect(() => {
	const container = containerRef.current;
	let instance, PSPDFKit;
	(async function() {
		PSPDFKit = await import("pspdfkit");
		PSPDFKit.unload(container)
		
		instance = await PSPDFKit.load(
		{
			// Container where PSPDFKit should be mounted.
			container,

			// The document to open.
			document: props.document,

			// Use the public directory URL as a base URL. PSPDFKit will download its library assets from here.
			baseUrl: `${window.location.protocol}//${window.location.host}/${process.env.PUBLIC_URL}`,
			
			//toolbar items
			toolbarItems: [
				// {"type":"sidebar-thumbnails"},
				{"type":"sidebar-annotations"},
				{"type":"pager"},{"type":"pan"},
				{"type":"zoom-out"},
				{"type":"zoom-in"},
				{"type":"zoom-mode"},
				{"type":"spacer"},
				{"type":"text"},
				{"type":"form-creator"},
				{"type":"image"},
				{"type":"document-editor"},
				{"type":"document-crop"},
				{"type":"search"},
				{"type":"export-pdf"},
				{"type":"debug"},
				// {"type":"line"},
				// {"type":"polygon"},
				// {"type":"cloudy-polygon"},
				// {"type":"polyline"},
				// {"type":"ellipse"},
			],

			annotationTooltipCallback: customAnnotationCallback,

			initialViewState: new PSPDFKit.ViewState({
				enableAnnotationToolbar: true,
			}),

			styleSheets: ["http://localhost:3000/pspdf.css"],

		}).then(instance=>
		{
			//do something here
			instanceRef.current = instance;
		});
	})();

	const customAnnotationCallback = (annotation) =>
	{
		if(annotation instanceof PSPDFKit.Annotations.WidgetAnnotation)
		{
			//main container
			const div = instanceRef.current.contentDocument.createElement("div");
			div.classList.add("custom__properties");

			//header
			const header = instanceRef.current.contentDocument.createElement("div");
			header.classList.add("custom__properties__header");
			div.appendChild(header);

			//first heading
			const label = instanceRef.current.contentDocument.createElement("h3");
			label.classList.add("custom__properties__heading");
			label.innerHTML = "Select Data:";
			header.appendChild(label);

			const selectDiv = instanceRef.current.contentDocument.createElement("div");
			selectDiv.classList.add("custom__properties__options__container");
			div.appendChild(selectDiv);

			const select1 = instanceRef.current.contentDocument.createElement("select");
			select1.classList.add("custom__properties__select");
			select1.setAttribute("id","select1");
			selectDiv.appendChild(select1);

			for(let i=0;i<5;i++)
			{
				const option = instanceRef.current.contentDocument.createElement("option");
				option.value = `Option ${i+1}`;
				option.textContent = option.value;
				select1.appendChild(option);
			}

			select1.addEventListener("change",(e)=>
			{
				console.log(e.target.value);
			});

			const select2 = instanceRef.current.contentDocument.createElement("select");
			select2.classList.add("custom__properties__select");
			select2.setAttribute("id","select2");
			selectDiv.appendChild(select2);

			for(let i=0;i<10;i++)
			{
				const option = instanceRef.current.contentDocument.createElement("option");
				option.value = `Sub Option ${i+1}`;
				option.textContent = option.value;
				select2.appendChild(option);
			}

			select2.addEventListener("change",(e)=>
			{
				console.log(e.target.value);
			});

			const footerDiv = instanceRef.current.contentDocument.createElement("div");
			footerDiv.classList.add("custom__properties__options__container");
			div.appendChild(footerDiv);

			const input = instanceRef.current.contentDocument.createElement("input");
			input.setAttribute("value","Save");
			input.setAttribute("type", "button");
			input.setAttribute("id", "finalizeButton");
			input.classList.add("custom__properties__button");
			input.type = "button";
			footerDiv.appendChild(input);

			input.addEventListener("click", (e) => 
			{
				let name = `~${select1.value}:${select2.value}~`;
				copyAnnotation(annotation,name,name);
			});

			// const input3 = instanceRef.current.contentDocument.createElement("input");
			// input3.setAttribute("value","Copy");
			// input3.setAttribute("type", "button");
			// input3.setAttribute("id", "finalizeButton");
			// input3.classList.add("custom__properties__button");
			// input3.type = "button";
			// footerDiv.appendChild(input3);
	
			// input3.addEventListener("click", (e) => 
			// {
			// 	duplicateAnnotation(annotation);
			// });

			const input2 = instanceRef.current.contentDocument.createElement("input");
			input2.setAttribute("value","Delete");
			input2.setAttribute("type", "button");
			input2.setAttribute("id", "finalizeButton");
			input2.classList.add("custom__properties__button");
			input2.type = "button";
			footerDiv.appendChild(input2);
	
			input2.addEventListener("click", (e) => 
			{
				removeAnnotation(annotation);
			});

			const toolItem = 
			{
				type: "custom",
				node: div,
				onPress: function () 
				{
					// console.log(annotation);
				},
			};
	  
			return [toolItem];
		}
		else 
		{
		  return [];
		}
	};

	function duplicateAnnotation(annotation) {
		debugger;
		if(!annotation.customData)
		{
			annotation.customData = {};
		}
		if(!("text" in annotation.customData))
		{
			annotation.customData.text = "";
		}
		copyAnnotation(annotation, annotation.customData.text,false);
		annotation.boundingBox.set("top", annotation.boundingBox.top + 50).set("left", annotation.boundingBox.left + 50);
		annotation.customData.coordinates = {
			bottom: annotation.boundingBox.bottom,
			height: annotation.boundingBox.height,
			left: annotation.boundingBox.left,
			right: annotation.boundingBox.right,
			top: annotation.boundingBox.top,
			width: annotation.boundingBox.width
		};
	};

	function copyAnnotation(annotation, newText, removeExisting = true) {
		try 
		{
			//this will hold values
			const createAnnotations = [];

			// create an annotation copy
			const widgetId = `${newText}_${PSPDFKit.generateInstantId()}`;
			const widget = new PSPDFKit.Annotations.WidgetAnnotation({
				id: widgetId,
				pageIndex: annotation.pageIndex,
				formFieldName: widgetId,
				boundingBox: new PSPDFKit.Geometry.Rect(annotation.boundingBox),
				borderWidth: 1,
				borderStyle: "solid",
				borderColor: PSPDFKit.Color.BLACK,
				font: 'Helvetica',
				fontSize: 16,
				fontColor: PSPDFKit.Color.RED,
				customData: {
					text: newText,
					widget_id: widgetId,
					coordinates: {
						bottom: annotation.boundingBox.bottom,
						height: annotation.boundingBox.height,
						left: annotation.boundingBox.left,
						right: annotation.boundingBox.right,
						top: annotation.boundingBox.top,
						width: annotation.boundingBox.width
					}
				},
				readOnly: true,
				isEditable: false,
			});

			const formField = new PSPDFKit.FormFields.TextFormField({
				name: widgetId,
				annotationIds: new PSPDFKit.Immutable.List([widget.id]),
				value: newText,
				font: 'Helvetica',
				fontSize: 16,
				fontColor: PSPDFKit.Color.RED,
				readOnly: true
			});

			createAnnotations.push(widget);
			createAnnotations.push(formField);
			instanceRef.current.create(createAnnotations);

			//remove the existing annotation
			if(removeExisting) instanceRef.current.delete(annotation);
		} 
		catch (error) 
		{
			
		}
	}

	function removeAnnotation(annotation)
	{
		try 
		{
			instanceRef.current.delete(annotation);
			console.log("Annotation Removed");
		} 
		catch (error) 
		{
			console.log(error);
		}
	}

	return () => PSPDFKit && PSPDFKit.unload(container);
}, []);

return (
	<div ref={containerRef} style={{ width: "100%", height: "100vh"}}/>
);
}