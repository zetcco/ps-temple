function TemplateItem({ template }) {
    return (
        <div key={template.id} className="my-5">
            <h2>{template.id}</h2>
            <p>{template.data.title}</p>
            <p>{template.data.tags.map((item) => `${item}, `)}</p>
        </div>           
    )
}

export default TemplateItem;