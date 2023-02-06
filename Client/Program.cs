using API.Contexts;
using Client.Base;
using Client.Repositories.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Net;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(10);//set 10 menit   
});

builder.Services.AddControllersWithViews();
//Add scoped

builder.Services.AddScoped<LoginRepository>();
builder.Services.AddScoped<Address>();

// Configure JWT
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters()
        {
            ValidateAudience = true,
            //Usually, this is your application base URL
            ValidAudience = builder.Configuration["JWT:Audience"],
            ValidateIssuer = true,
            //If the JWT is created using a web service, then this would be the consumer URL.
            ValidIssuer = builder.Configuration["JWT:Issuer"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:Key"])),
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    });

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

// Custome Error page
app.UseStatusCodePages(async context =>
{
	var request = context.HttpContext.Request;
	var response = context.HttpContext.Response;

	if (response.StatusCode.Equals((int)HttpStatusCode.Unauthorized))
	{
		response.Redirect("/Unauthorized");
	}
	else if (response.StatusCode.Equals((int)HttpStatusCode.NotFound))
	{
		response.Redirect("/NotFound");
	}
	else if (response.StatusCode.Equals((int)HttpStatusCode.Forbidden))
	{
		response.Redirect("/Forbidden");
	}
});

app.UseSession();
app.Use(async (context, next) =>
{
	var JWToken = context.Session.GetString("JWToken");
	if (!string.IsNullOrEmpty(JWToken))
	{
		context.Request.Headers.Add("Authorization", "Bearer " + JWToken);
	}
	await next();
});

app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();