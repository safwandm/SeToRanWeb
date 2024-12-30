<script>
    export let discount = {
        id: 1,
        title: "Discount Title",
        description: "This is a detailed description of the discount.",
        percentage: 20,
        validUntil: "2023-12-31"
    };
</script>

<main>
    <h1>{discount.title}</h1>
    <p>{discount.description}</p>
    <p>Discount: {discount.percentage}%</p>
    <p>Valid Until: {discount.validUntil}</p>
</main>

<style>
    main {
        padding: 1rem;
        background-color: #f9f9f9;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    h1 {
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
    }

    p {
        margin: 0.5rem 0;
    }
</style>